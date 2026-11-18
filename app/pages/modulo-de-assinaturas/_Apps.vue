<script setup lang="ts">
/**
 * Configurações > Integrações > Apps, a loja de apps.
 *
 * Cópia da prévia: as seções por assunto e o card por app. PROPOSTA (B1 e B2):
 * - a seção "Assinatura eletrônica" traz os 5 provedores do módulo novo, com 1 estado em texto e 1 botão. É daqui que
 *   se chega à página do provedor; o item "Assinatura Eletrônica" sai do menu;
 * - a descrição do card diz o que o provedor faz, em linguagem de quem configura (M26). Os recursos técnicos ficam na
 *   página do provedor;
 * - as 5 integrações antigas ficam recolhidas embaixo, com 1 aviso para as 5 (hoje o mesmo aviso aparece 5 vezes).
 */
import type { ProvedorId } from './mocks'
import { provedores } from './mocks'
import { credenciaisVisiveis, credencialPronta, estado } from './estado'
import type { Textos } from './textos'
import Monograma from './_Monograma.vue'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ abrir: [ProvedorId] }>()
const toast = useToast()
const a = computed(() => props.t.apps)

function estadoDo(id: ProvedorId) {
  const creds = credenciaisVisiveis.value.filter(c => c.provedor === id)
  if (!creds.length) return { texto: a.value.naoConectado, cor: 'text-muted', ponto: 'bg-(--ui-text-dimmed)', conectado: false }
  const falta = creds.some(c => !credencialPronta(c)) || (provedores.find(p => p.id === id)!.webhook === 'conta' && !estado.webhookConfirmado[id])
  return falta
    ? { texto: a.value.faltaEtapa, cor: 'text-warning', ponto: 'bg-warning', conectado: true }
    : { texto: a.value.conectado(creds.length), cor: 'text-success', ponto: 'bg-success', conectado: true }
}

const outros = [
  { secao: 'ia', apps: [{ id: 'openai', nome: 'OpenAI', icone: 'i-simple-icons-openai', instalado: true }] },
  { secao: 'documentos', apps: [{ id: 'word', nome: 'Plugin do Word', icone: 'i-lucide-file-text', instalado: false, plugin: true }] },
  { secao: 'emails', apps: [{ id: 'sendgrid', nome: 'SendGrid', icone: 'i-lucide-send', instalado: true }] },
  { secao: 'mensagens', apps: [{ id: 'twilio', nome: 'Twilio', icone: 'i-lucide-message-square', instalado: false }] },
]

const legados = ['ClickSign', 'Certisign', 'D4Sign', 'DocuSign', 'Adobe Sign']
const legadoAberto = ref(false)
const foraDoEscopo = () => toast.add({ title: props.t.geral.foraDoEscopo, description: props.t.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-6xl space-y-8 px-6 py-6">
      <h1 class="text-xl font-semibold text-highlighted">{{ a.titulo }}</h1>

      <!-- Inteligência Artificial (cópia) -->
      <section v-for="(s, si) in [outros[0]!]" :key="s.secao" class="space-y-3">
        <h2 class="text-sm font-semibold text-highlighted">{{ a.secoes[s.secao] }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="app in s.apps" :key="app.id" class="flex animate-[entrada_.3s_ease-out_both] flex-col gap-3 rounded-lg border border-default bg-default p-4" :style="{ animationDelay: `${si * 40}ms` }">
            <div class="flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-md bg-elevated"><UIcon :name="app.icone" class="size-5 text-highlighted" /></span>
              <span class="font-medium text-highlighted">{{ app.nome }}</span>
            </div>
            <p class="line-clamp-2 text-sm text-muted">{{ a.descricoes[app.id] }}</p>
            <UButton :label="app.instalado ? a.gerenciar : a.instalar" color="neutral" variant="outline" size="sm" block class="mt-auto" @click="foraDoEscopo" />
          </div>
        </div>
      </section>

      <!-- PROPOSTA: os provedores de assinatura ficam na loja -->
      <section class="space-y-3" aria-labelledby="secao-assinatura">
        <h2 id="secao-assinatura" class="text-sm font-semibold text-highlighted">{{ a.secoes.assinatura }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <button
            v-for="(p, i) in provedores"
            :key="p.id"
            type="button"
            class="group flex animate-[entrada_.3s_ease-out_both] flex-col gap-3 rounded-lg border border-default bg-default p-4 text-left transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-accented hover:shadow-sm focus-visible:outline-2 focus-visible:outline-primary"
            :style="{ animationDelay: `${60 + i * 40}ms` }"
            @click="emit('abrir', p.id)"
          >
            <span class="flex items-center gap-3">
              <Monograma :provedor="p.id" />
              <span class="font-medium text-highlighted">{{ p.nome }}</span>
            </span>
            <span class="line-clamp-2 text-sm text-muted">{{ a.descricoes[p.id] }}</span>
            <span class="mt-auto flex items-center justify-between gap-2 pt-1">
              <span class="flex min-w-0 items-center gap-1.5 text-xs font-medium" :class="estadoDo(p.id).cor">
                <span class="size-1.5 shrink-0 rounded-full" :class="estadoDo(p.id).ponto" />
                <span class="truncate">{{ estadoDo(p.id).texto }}</span>
              </span>
              <span class="flex shrink-0 items-center gap-1 text-sm font-medium text-primary">
                {{ estadoDo(p.id).conectado ? a.gerenciar : a.conectar }}
                <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </span>
          </button>
        </div>

        <!-- PROPOSTA: 1 aviso para as 5 integrações antigas, recolhidas -->
        <div class="rounded-lg border border-default bg-elevated/40">
          <div class="flex flex-wrap items-center gap-3 px-4 py-3">
            <UIcon name="i-lucide-archive" class="size-4 shrink-0 text-muted" />
            <p class="min-w-60 flex-1 text-sm text-toned">{{ a.legadoAviso }}</p>
            <UButton
              :label="legadoAberto ? a.legadoOcultar : a.legadoVer(legados.length)"
              :trailing-icon="legadoAberto ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
              color="neutral"
              variant="outline"
              size="sm"
              :aria-expanded="legadoAberto"
              @click="legadoAberto = !legadoAberto"
            />
          </div>
          <Transition enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
            <div v-if="legadoAberto" class="grid gap-3 border-t border-default p-4 sm:grid-cols-2 xl:grid-cols-3">
              <div v-for="nome in legados" :key="nome" class="flex items-center gap-3 rounded-md border border-default bg-default px-3 py-2.5">
                <span class="flex size-8 items-center justify-center rounded-md bg-elevated text-xs font-semibold text-muted">{{ nome.slice(0, 2).toUpperCase() }}</span>
                <span class="min-w-0 flex-1 truncate text-sm text-highlighted">{{ nome }}</span>
                <UBadge :label="a.legadoSelo" color="neutral" variant="soft" size="sm" />
                <UButton :label="a.gerenciar" color="neutral" variant="ghost" size="xs" @click="foraDoEscopo" />
              </div>
            </div>
          </Transition>
        </div>
      </section>

      <!-- Documentos, E-mails e Canais de mensagem (cópia) -->
      <section v-for="s in outros.slice(1)" :key="s.secao" class="space-y-3">
        <h2 class="text-sm font-semibold text-highlighted">{{ a.secoes[s.secao] }}</h2>
        <div class="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <div v-for="app in s.apps" :key="app.id" class="flex flex-col gap-3 rounded-lg border border-default bg-default p-4">
            <div class="flex items-center gap-3">
              <span class="flex size-10 items-center justify-center rounded-md bg-elevated"><UIcon :name="app.icone" class="size-5 text-highlighted" /></span>
              <span class="font-medium text-highlighted">{{ app.nome }}</span>
            </div>
            <p class="line-clamp-2 text-sm text-muted">{{ a.descricoes[app.id] }}</p>
            <UButton :label="'plugin' in app ? a.usarPlugin : app.instalado ? a.gerenciar : a.instalar" color="neutral" variant="outline" size="sm" block class="mt-auto" @click="foraDoEscopo" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Configurações > Integrações > Apps, a loja de apps.
 *
 * Cópia da prévia: as seções por assunto (Inteligência Artificial, Documentos, E-mails, Canais de mensagem) e os apps de
 * cada uma. PROPOSTA:
 * - B1: a seção "Assinatura eletrônica" traz os 5 provedores do módulo novo. É daqui que se chega à página do provedor;
 *   o item "Assinatura Eletrônica" sai do menu;
 * - 1 formato de card para todo app (`_CardDeApp.vue`): logo, nome, descrição, estado em texto e 1 botão
 *   "Ver detalhes". Hoje são 3 formatos de botão e 4 rótulos (Gerenciar Integração, Instalar Integração, Utilizar
 *   Plugin, link rosa com seta);
 * - o estado usa o mesmo vocabulário em todo app: Conectado, Falta 1 etapa, Não conectado, Legado;
 * - busca e filtro Todos, Conectados e Não conectados, com a contagem;
 * - cada seção diz para que serve, numa linha;
 * - B2: as 5 integrações antigas ficam recolhidas na seção de assinatura, com 1 aviso para as 5 e o mesmo card.
 */
import type { ProvedorId } from './mocks'
import { provedores } from './mocks'
import { credenciaisVisiveis, credencialPronta, estado } from './estado'
import type { Textos } from './textos'
import type { TomDoEstado } from './_CardDeApp.vue'
import CardDeApp from './_CardDeApp.vue'
import type { AppComLogo } from './_Logo.vue'

const props = defineProps<{ t: Textos }>()
const emit = defineEmits<{ abrir: [ProvedorId] }>()
const toast = useToast()
const a = computed(() => props.t.apps)

type Secao = 'ia' | 'assinatura' | 'documentos' | 'emails' | 'mensagens'
interface App { id: string, nome: string, secao: Secao, estado: { texto: string, tom: TomDoEstado, detalhe?: string }, conectado: boolean, logo: AppComLogo, provedor?: ProvedorId, legado?: boolean }

function estadoDoProvedor(id: ProvedorId) {
  const creds = credenciaisVisiveis.value.filter(c => c.provedor === id)
  const e = a.value.estados
  if (!creds.length) return { texto: e.naoConectado!, tom: 'neutral' as const }
  const falta = creds.some(c => !credencialPronta(c)) || (provedores.find(p => p.id === id)!.webhook === 'conta' && !estado.webhookConfirmado[id])
  return { texto: falta ? e.faltaEtapa! : e.conectado!, tom: falta ? 'warning' as const : 'success' as const, detalhe: a.value.credenciais(creds.length) }
}

const apps = computed<App[]>(() => {
  const e = a.value.estados
  const ligado = { texto: e.conectado!, tom: 'success' as const }
  const desligado = { texto: e.naoConectado!, tom: 'neutral' as const }
  return [
    { id: 'openai', nome: 'OpenAI', secao: 'ia', logo: 'openai', estado: ligado, conectado: true },
    ...provedores.map(p => ({ id: p.id, nome: p.nome, secao: 'assinatura' as const, logo: p.id, provedor: p.id, estado: estadoDoProvedor(p.id), conectado: estadoDoProvedor(p.id).tom !== 'neutral' })),
    { id: 'word', nome: 'Plugin do Word', secao: 'documentos', logo: 'word', estado: desligado, conectado: false },
    { id: 'sendgrid', nome: 'SendGrid', secao: 'emails', logo: 'sendgrid', estado: ligado, conectado: true },
    { id: 'twilio', nome: 'Twilio', secao: 'mensagens', logo: 'twilio', estado: desligado, conectado: false },
  ]
})
// Os fluxos de categoria que ainda usam cada integração antiga (inventado). O aviso comum fica no cabeçalho do grupo;
// o card diz o que é só dele: quem usa.
const usoDoLegado: Record<ProvedorId, string[]> = {
  clicksign: ['Contratos de locação', 'Termos de confidencialidade'], certisign: ['Contratos de fornecedores'], d4sign: ['Admissões'], docusign: [], adobesign: ['Propostas comerciais'],
}
const legados = computed<(App & { uso: string[] })[]>(() => provedores.map(p => ({
  id: `legado-${p.id}`, nome: p.id === 'adobesign' ? 'Adobe Sign' : p.nome, secao: 'assinatura', logo: p.id, provedor: p.id, legado: true, conectado: false, uso: usoDoLegado[p.id],
  estado: usoDoLegado[p.id].length
    ? { texto: a.value.emUso, tom: 'neutral', detalhe: a.value.fluxos(usoDoLegado[p.id].length) }
    : { texto: a.value.semUso, tom: 'neutral' },
})))

/* ---------- busca e filtro ---------- */
const busca = ref('')
const filtro = ref<'todos' | 'conectados' | 'naoConectados'>('todos')
const normalizar = (s: string) => s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
const casa = (app: App) => {
  const q = normalizar(busca.value.trim())
  return !q || [app.nome, a.value.secoes[app.secao]!, a.value.descricoes[app.id.replace('legado-', '')] ?? ''].some(x => normalizar(x).includes(q))
}
const contagem = computed(() => ({
  todos: apps.value.length,
  conectados: apps.value.filter(x => x.conectado).length,
  naoConectados: apps.value.filter(x => !x.conectado).length,
}))
const abas = computed(() => (['todos', 'conectados', 'naoConectados'] as const).map(k => ({ value: k, label: a.value.filtros[k], badge: { label: String(contagem.value[k]), color: 'neutral' as const, variant: 'soft' as const } })))
const visiveis = computed(() => apps.value.filter(x => casa(x) && (filtro.value === 'todos' || (filtro.value === 'conectados' ? x.conectado : !x.conectado))))
const legadosVisiveis = computed(() => (filtro.value === 'todos' ? legados.value.filter(casa) : []))

const secoes: { id: Secao, icone: string }[] = [
  { id: 'ia', icone: 'i-lucide-sparkles' },
  { id: 'assinatura', icone: 'i-lucide-signature' },
  { id: 'documentos', icone: 'i-lucide-file-text' },
  { id: 'emails', icone: 'i-lucide-mail' },
  { id: 'mensagens', icone: 'i-lucide-message-square' },
]
const secoesComApps = computed(() => secoes
  .map(s => ({ ...s, apps: visiveis.value.filter(x => x.secao === s.id) }))
  .filter(s => s.apps.length || (s.id === 'assinatura' && legadosVisiveis.value.length)))

const legadoAberto = ref(false)
watch(busca, (q) => { if (q.trim() && legadosVisiveis.value.length) legadoAberto.value = true })

const foraDoEscopo = () => toast.add({ title: props.t.geral.foraDoEscopo, description: props.t.geral.foraDoEscopoDesc, icon: 'i-lucide-construction', color: 'neutral' })
function abrir(app: App) {
  if (app.provedor && !app.legado) emit('abrir', app.provedor)
  else foraDoEscopo()
}
</script>

<template>
  <div class="min-h-0 flex-1 overflow-y-auto">
    <div class="mx-auto max-w-6xl space-y-6 px-6 py-6">
      <!-- PROPOSTA: título com a linha do que é a tela, busca e filtro -->
      <header class="space-y-4">
        <div>
          <h1 class="text-xl font-semibold text-highlighted">{{ a.titulo }}</h1>
          <p class="mt-1 text-sm text-muted">{{ a.subtitulo }}</p>
        </div>
        <div class="flex flex-wrap items-center justify-between gap-3">
          <UTabs v-model="filtro" :items="abas" :content="false" variant="pill" size="sm" color="neutral" />
          <UInput v-model="busca" icon="i-lucide-search" :placeholder="a.buscar" class="w-72" :aria-label="a.buscar">
            <template v-if="busca" #trailing>
              <UButton icon="i-lucide-x" color="neutral" variant="link" size="xs" :aria-label="a.limparBusca" @click="busca = ''" />
            </template>
          </UInput>
        </div>
      </header>

      <UEmpty
        v-if="!secoesComApps.length"
        icon="i-lucide-search-x"
        :title="a.vazioBusca"
        variant="naked"
        class="py-16"
        :actions="[{ label: a.limparBusca, color: 'neutral', variant: 'outline', onClick: () => { busca = ''; filtro = 'todos' } }]"
      />

      <TransitionGroup tag="div" class="space-y-10" enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
        <section v-for="(s, si) in secoesComApps" :key="s.id" class="space-y-4" :aria-labelledby="`secao-${s.id}`">
          <div class="flex items-start gap-3 border-b border-default pb-3">
            <span class="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <UIcon :name="s.icone" class="size-4" />
            </span>
            <div class="min-w-0 flex-1">
              <h2 :id="`secao-${s.id}`" class="flex items-center gap-2 font-semibold text-highlighted">
                {{ a.secoes[s.id] }}
                <span class="text-sm font-normal tabular-nums text-muted">{{ s.apps.length }}</span>
                <UBadge v-if="s.id === 'assinatura'" :label="a.novo" color="primary" variant="subtle" size="sm" />
              </h2>
              <p class="text-sm text-muted">{{ a.secaoDesc[s.id] }}</p>
            </div>
          </div>

          <div v-if="s.apps.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <CardDeApp
              v-for="(app, i) in s.apps"
              :key="app.id"
              :nome="app.nome"
              :descricao="a.descricoes[app.id]!"
              :estado="app.estado"
              :rotulo="a.verDetalhes"
              :logo="app.logo"
              class="animate-[entrada_.3s_ease-out_both]"
              :style="{ animationDelay: `${Math.min(si * 2 + i, 12) * 35}ms` }"
              @abrir="abrir(app)"
            />
          </div>

          <!-- PROPOSTA (B2): as integrações antigas, recolhidas, com 1 aviso e o mesmo card -->
          <div v-if="s.id === 'assinatura' && legadosVisiveis.length" class="rounded-xl border border-dashed border-default">
            <button
              type="button"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left transition-colors hover:bg-elevated/50 focus-visible:outline-2 focus-visible:outline-primary"
              :aria-expanded="legadoAberto"
              @click="legadoAberto = !legadoAberto"
            >
              <UIcon name="i-lucide-archive" class="size-4 shrink-0 text-muted" />
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-medium text-highlighted">{{ a.legadoTitulo }} <span class="font-normal tabular-nums text-muted">{{ legadosVisiveis.length }}</span></span>
                <span class="block text-sm text-muted">{{ a.legadoDesc }}</span>
              </span>
              <UIcon name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted transition-transform duration-200" :class="legadoAberto && 'rotate-180'" />
            </button>
            <Transition enter-active-class="transition-[opacity,transform] duration-200 ease-out" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
              <div v-if="legadoAberto" class="grid gap-4 border-t border-dashed border-default p-4 sm:grid-cols-2 xl:grid-cols-3">
                <CardDeApp
                  v-for="app in legadosVisiveis"
                  :key="app.id"
                  :nome="app.nome"
                  :descricao="a.legadoUso(app.uso)"
                  :estado="app.estado"
                  :rotulo="a.verDetalhes"
                  :logo="app.logo"
                  apagado
                  @abrir="abrir(app)"
                />
              </div>
            </Transition>
          </div>
        </section>
      </TransitionGroup>
    </div>
  </div>
</template>

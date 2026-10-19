<script setup lang="ts">
/**
 * Pedido 1 (parte 2): Logs › Envio ao SIEM. Tela nova.
 *
 * Referências: GitHub (Log streaming, "Check endpoint" antes de salvar, pausa
 * sem perda), Azure DevOps (destino Azure Monitor, desliga e mostra o erro) e o
 * conector CCF Push do Sentinel, que pede 6 valores (Tenant ID, Application ID,
 * Secret, DCE, DCR Immutable ID, Stream). O par Workspace ID + Shared Key é da API
 * que a Microsoft aposenta: não entra.
 */
import type { Textos } from './textos'
import type { Tela } from './_CascaDoAdmin.vue'
import Cabecalho from './_Cabecalho.vue'
import { destinosSiem, ha } from './mocks'
import type { Categoria, DestinoSiem, TipoDeDestinoSiem } from './mocks'
import { numero, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const emit = defineEmits<{ navegar: [tela: Tela] }>()
const idioma = useIdioma()
const toast = useToast()
const ts = computed(() => props.t.siem)

const destinos = useState<DestinoSiem[]>('sa-siem', () => structuredClone(destinosSiem))
const categorias: Categoria[] = ['acesso', 'leitura', 'alteracao', 'saida', 'admin', 'protecao']
const iconeDoTipo: Record<TipoDeDestinoSiem, string> = { sentinel: 'i-lucide-shield-half', eventhub: 'i-lucide-cable', https: 'i-lucide-send' }
const corDoEstado = { ativo: 'success', pausado: 'neutral', erro: 'error' } as const

const testando = ref<string | null>(null)
function testar(d: DestinoSiem) {
  testando.value = d.id
  setTimeout(() => {
    testando.value = null
    if (d.estado === 'erro') {
      toast.add({ title: d.erro ?? '', icon: 'i-lucide-circle-x', color: 'error' })
      return
    }
    toast.add({ title: ts.value.testeOk, icon: 'i-lucide-plug-zap', color: 'success' })
  }, 1100)
}
function alternarPausa(d: DestinoSiem) {
  d.estado = d.estado === 'pausado' ? 'ativo' : 'pausado'
  toast.add({ title: d.estado === 'pausado' ? ts.value.pausado : ts.value.retomado, icon: d.estado === 'pausado' ? 'i-lucide-pause' : 'i-lucide-play', color: 'neutral' })
}
function corrigir(d: DestinoSiem) {
  testando.value = d.id
  setTimeout(() => {
    testando.value = null
    d.estado = 'ativo'
    d.erro = undefined
    d.ultimoEnvio = ha(5 * 1000)
    toast.add({ title: ts.value.testeOk, description: ts.value.reenvio, icon: 'i-lucide-plug-zap', color: 'success' })
  }, 1300)
}
function excluir(d: DestinoSiem) {
  destinos.value = destinos.value.filter(x => x.id !== d.id)
  toast.add({ title: ts.value.excluido, icon: 'i-lucide-trash-2', color: 'neutral' })
}

/* ---------- novo destino ---------- */
const novo = ref(false)
const tipo = ref<TipoDeDestinoSiem>('sentinel')
const form = reactive<Record<string, string>>({})
const escolhidas = ref<Categoria[]>(['acesso', 'leitura', 'saida', 'admin', 'protecao'])
const testado = ref(false)
const testandoNovo = ref(false)

const camposDoTipo: Record<TipoDeDestinoSiem, { chave: keyof Textos['siem']['campos'], ph: string, secreto?: boolean, opcional?: boolean }[]> = {
  sentinel: [
    { chave: 'tenant', ph: '72f988bf-86f1-41af-91ab-2d7cd011db47' },
    { chave: 'app', ph: 'b1c2d3e4-0000-4a5b-9c8d-123456789abc' },
    { chave: 'segredo', ph: '••••••••••••••••', secreto: true },
    { chave: 'dce', ph: 'https://enspace-dce-x1y2.brazilsouth-1.ingest.monitor.azure.com' },
    { chave: 'dcr', ph: 'dcr-6f1e0a9b2c3d4e5f60718293a4b5c6d7' },
    { chave: 'stream', ph: 'Custom-EnspaceAudit_CL' },
  ],
  eventhub: [
    { chave: 'namespace', ph: 'horizonte-soc.servicebus.windows.net' },
    { chave: 'hub', ph: 'enspace-audit' },
    { chave: 'politica', ph: 'enspace-send' },
    { chave: 'chave', ph: '••••••••••••••••', secreto: true },
  ],
  https: [
    { chave: 'url', ph: 'https://siem.horizontebio.com.br/ingest/enspace' },
    { chave: 'auth', ph: 'Bearer ...', secreto: true, opcional: true },
  ],
}
const itensTipo = computed(() => (['sentinel', 'eventhub', 'https'] as const).map(v => ({ label: ts.value.tipos[v], value: v, description: ts.value.tiposAjuda[v], icon: iconeDoTipo[v] })))
const faltando = computed(() => !form.nome?.trim() || camposDoTipo[tipo.value].some(c => !c.opcional && !form[c.chave]?.trim()))

function abrirNovo() {
  Object.keys(form).forEach(k => delete form[k])
  tipo.value = 'sentinel'
  testado.value = false
  novo.value = true
}
watch([tipo, () => ({ ...form })], () => { testado.value = false })
function testarNovo() {
  testandoNovo.value = true
  setTimeout(() => {
    testandoNovo.value = false
    testado.value = true
  }, 1200)
}
function salvarNovo() {
  destinos.value.push({ id: `s${Date.now()}`, nome: form.nome!, tipo: tipo.value, estado: 'ativo', categorias: [...escolhidas.value], ultimoEnvio: null, enviados24h: 0 })
  novo.value = false
  toast.add({ title: ts.value.salvo, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div>
    <Cabecalho :titulo="ts.titulo" :intro="ts.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <UButton :label="ts.adicionar" icon="i-lucide-plus" size="sm" @click="abrirNovo" />
      </template>
    </Cabecalho>

    <div class="grid gap-4 p-6 xl:grid-cols-[1fr_20rem]">
      <div class="space-y-3">
        <TransitionGroup enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-2" leave-active-class="transition duration-200" leave-to-class="opacity-0 -translate-x-4">
          <article
            v-for="(d, i) in destinos"
            :key="d.id"
            class="animate-[entrada_.3s_ease-out_both] rounded-lg border bg-default p-4 transition-shadow hover:shadow-sm"
            :class="d.estado === 'erro' ? 'border-error/50' : 'border-default'"
            :style="{ animationDelay: `${i * 60}ms` }"
          >
            <div class="flex flex-wrap items-start gap-3">
              <span class="flex size-10 items-center justify-center rounded-lg bg-elevated">
                <UIcon :name="iconeDoTipo[d.tipo]" class="size-5 text-primary" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex flex-wrap items-center gap-2">
                  <h3 class="font-semibold text-highlighted">{{ d.nome }}</h3>
                  <UBadge :label="ts.estados[d.estado]" :color="corDoEstado[d.estado]" variant="soft" size="sm" :icon="d.estado === 'ativo' ? 'i-lucide-circle-check' : d.estado === 'erro' ? 'i-lucide-circle-alert' : 'i-lucide-circle-pause'" />
                </div>
                <p class="text-xs text-muted">{{ ts.tipos[d.tipo] }}</p>
                <p class="mt-1 text-xs text-toned">
                  <span v-if="d.ultimoEnvio">{{ ts.ultimoEnvio(relativo(d.ultimoEnvio, idioma)) }} · </span>{{ ts.enviados(numero(d.enviados24h, idioma)) }}
                </p>
                <div class="mt-2 flex flex-wrap gap-1">
                  <UBadge v-for="c in d.categorias" :key="c" :label="t.auditoria.categorias[c]" color="neutral" variant="outline" size="sm" />
                </div>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <UButton :label="testando === d.id ? ts.testando : ts.testar" :loading="testando === d.id" icon="i-lucide-plug-zap" size="xs" color="neutral" variant="outline" @click="testar(d)" />
                <UButton v-if="d.estado !== 'erro'" :label="d.estado === 'pausado' ? ts.retomar : ts.pausar" :icon="d.estado === 'pausado' ? 'i-lucide-play' : 'i-lucide-pause'" size="xs" color="neutral" variant="outline" @click="alternarPausa(d)" />
                <UButton icon="i-lucide-trash-2" size="xs" color="neutral" variant="ghost" :aria-label="t.comum.excluir" @click="excluir(d)" />
              </div>
            </div>
            <UAlert
              v-if="d.estado === 'erro'"
              class="mt-3"
              color="error"
              variant="soft"
              icon="i-lucide-circle-alert"
              :title="d.erro"
              :description="ts.reenvio"
              :actions="[{ label: ts.atualizarCredencial, color: 'error', variant: 'solid', size: 'xs', loading: testando === d.id, onClick: () => corrigir(d) }]"
            />
          </article>
        </TransitionGroup>
      </div>

      <aside class="space-y-3">
        <div class="rounded-lg border border-default bg-default p-4">
          <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-download-cloud" class="size-4 text-primary" />{{ ts.apiTitulo }}</h3>
          <p class="mt-1 text-sm text-muted">{{ ts.api }}</p>
          <code class="mt-2 block rounded-md bg-elevated px-2 py-1.5 font-mono text-[11px] text-highlighted">GET /v1/audit-logs?since=2026-10-19T00:00:00Z</code>
          <UButton :label="ts.irContas" trailing-icon="i-lucide-arrow-right" size="xs" variant="outline" class="mt-3" @click="emit('navegar', 'contas')" />
        </div>
      </aside>
    </div>

    <!-- Novo destino -->
    <USlideover v-model:open="novo" :title="ts.novoTitulo" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="ts.tipo">
            <USelect v-model="tipo" :items="itensTipo" class="w-full" />
            <template #help>{{ ts.tiposAjuda[tipo] }}</template>
          </UFormField>
          <UFormField :label="ts.nome" required>
            <UInput v-model="form.nome" :placeholder="ts.nomePh" class="w-full" />
          </UFormField>
          <UAlert v-if="tipo === 'sentinel'" icon="i-lucide-info" color="info" variant="subtle" :description="ts.ajudaSentinel" />
          <Transition mode="out-in" enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-y-1">
            <div :key="tipo" class="space-y-3">
              <UFormField v-for="c in camposDoTipo[tipo]" :key="c.chave" :label="ts.campos[c.chave]" :required="!c.opcional">
                <UInput v-model="form[c.chave]" :placeholder="c.ph" :type="c.secreto ? 'password' : 'text'" class="w-full" :ui="{ base: 'font-mono text-xs' }" />
              </UFormField>
            </div>
          </Transition>
          <UFormField :label="ts.categoriasTitulo">
            <UCheckboxGroup v-model="escolhidas" :items="categorias.map(c => ({ label: t.auditoria.categorias[c], value: c }))" orientation="horizontal" :ui="{ fieldset: 'flex-wrap gap-x-4 gap-y-2' }" />
          </UFormField>
          <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-95">
            <UAlert v-if="testado" icon="i-lucide-circle-check" color="success" variant="soft" :description="ts.testeOk" />
          </Transition>
        </div>
      </template>
      <template #footer>
        <div class="flex w-full items-center gap-2">
          <span v-if="!testado && !faltando" class="text-xs text-muted">{{ ts.precisaTestar }}</span>
          <UButton :label="testandoNovo ? ts.testando : ts.testar" :loading="testandoNovo" :disabled="faltando" icon="i-lucide-plug-zap" color="neutral" variant="outline" class="ml-auto" @click="testarNovo" />
          <UButton :label="t.comum.salvar" :disabled="!testado || faltando" @click="salvarNovo" />
        </div>
      </template>
    </USlideover>
  </div>
</template>

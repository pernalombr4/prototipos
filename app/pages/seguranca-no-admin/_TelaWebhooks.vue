<script setup lang="ts">
/**
 * Pedido 9: Integrações › Webhooks. Tela nova.
 *
 * Hoje o schema `Webhook` não tem segredo: o envio não é assinado. No admin há só
 * rate limit dos webhooks públicos de workflow. Referências: Stripe (segredo
 * oculto até revelar, troca com 24 h de sobreposição, aba de entregas), Standard
 * Webhooks (cabeçalhos webhook-id, webhook-timestamp, webhook-signature).
 * Nenhum produto pesquisado obriga a assinatura na organização inteira: o
 * interruptor "Exigir assinatura" e o tratamento dos webhooks sem segredo são
 * proposta.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { MIN, ha, nomeDoWorkspace, webhooksIniciais } from './mocks'
import type { WebhookDaOrg } from './mocks'
import { data, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const tw = computed(() => props.t.webhooks)

const webhooks = useState<WebhookDaOrg[]>('sa-webhooks', () => structuredClone(webhooksIniciais))
const exigir = useState('sa-webhooks-exigir', () => false)
const aba = ref<'lista' | 'politica'>('lista')

/* ---------- política ---------- */
const exigirRascunho = ref(exigir.value)
const tratamento = ref<'gerar' | 'pausar'>('gerar')
const semSegredo = computed(() => webhooks.value.filter(w => !w.assinado))
const aplicando = ref(false)
function aplicar() {
  aplicando.value = true
  setTimeout(() => {
    for (const w of semSegredo.value) {
      if (tratamento.value === 'gerar') {
        w.assinado = true
        w.segredoCriado = new Date()
      }
      else {
        w.is_active = false
      }
    }
    exigir.value = exigirRascunho.value
    aplicando.value = false
    toast.add({ title: tw.value.aplicada, icon: 'i-lucide-shield-check', color: 'success' })
  }, 800)
}

/* ---------- lista ---------- */
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'url', label: tw.value.col.url },
  { key: 'workspace', label: tw.value.col.workspace },
  { key: 'events', label: tw.value.col.eventos },
  { key: 'assinado', label: tw.value.col.assinatura },
  { key: 'failed_attempts_count', label: tw.value.col.falhas, align: 'right' },
  { key: 'is_active', label: tw.value.col.estado },
])

const aberto = ref<WebhookDaOrg | null>(null)
const detalhe = computed({ get: () => !!aberto.value, set: (v) => { if (!v) aberto.value = null } })
const revelado = ref(false)
function abrir(row: Record<string, unknown>) {
  aberto.value = row as unknown as WebhookDaOrg
  revelado.value = false
}
const trocar = ref(false)
const quando = ref<'ja' | 'depois'>('depois')
function confirmarTroca() {
  if (aberto.value) aberto.value.segredoCriado = new Date()
  trocar.value = false
  revelado.value = true
  toast.add({ title: tw.value.trocado, icon: 'i-lucide-refresh-cw', color: 'success' })
}
function gerarSegredo() {
  if (!aberto.value) return
  aberto.value.assinado = true
  aberto.value.is_active = true
  aberto.value.segredoCriado = new Date()
  revelado.value = true
  toast.add({ title: tw.value.gerado, icon: 'i-lucide-key-round', color: 'success' })
}
const entregas = computed(() => aberto.value
  ? [0, 1, 2, 3, 4].map(i => ({ quando: ha((i * 37 + 4) * MIN), evento: aberto.value!.events[i % aberto.value!.events.length], status: aberto.value!.failed_attempts_count && i < 2 ? 500 : 200, ms: 180 + i * 43 }))
  : [])

const exemplo = `const id = req.headers['webhook-id']
const ts = req.headers['webhook-timestamp']
const assinaturas = req.headers['webhook-signature'].split(' ')

if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) recusar()

const esperado = 'v1,' + crypto
  .createHmac('sha256', Buffer.from(segredo.split('_')[1], 'base64'))
  .update(\`\${id}.\${ts}.\${corpoCru}\`)
  .digest('base64')

if (!assinaturas.includes(esperado)) recusar()`
</script>

<template>
  <div>
    <Cabecalho :titulo="tw.titulo" :intro="tw.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <UBadge v-if="exigir" :label="tw.exigir" icon="i-lucide-shield-check" color="success" variant="soft" />
      </template>
    </Cabecalho>

    <div class="px-6 pt-3">
      <UTabs
        v-model="aba"
        :items="[{ label: `${tw.abaLista} (${webhooks.length})`, value: 'lista', icon: 'i-lucide-webhook' }, { label: tw.abaPolitica, value: 'politica', icon: 'i-lucide-shield-check' }]"
        variant="link"
        :content="false"
        size="sm"
      />
    </div>

    <div v-if="aba === 'lista'" class="p-6 animate-[entrada_.25s_ease-out]">
      <EnTable :columns="colunas" :rows="(webhooks as unknown as Record<string, unknown>[])" :locale="idioma" @row-click="abrir">
        <template #cell-url="{ row }"><code class="block max-w-80 truncate font-mono text-xs text-highlighted">{{ (row as any).url }}</code></template>
        <template #cell-workspace="{ row }"><span class="text-sm text-toned">{{ nomeDoWorkspace((row as any).workspace) }}</span></template>
        <template #cell-events="{ row }">
          <span class="flex flex-wrap gap-1"><UBadge v-for="e in (row as any).events" :key="e" :label="e" color="neutral" variant="outline" size="sm" class="font-mono" /></span>
        </template>
        <template #cell-assinado="{ row }">
          <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-75">
            <UBadge :key="String((row as any).assinado)" :label="(row as any).assinado ? tw.assinado : tw.semAssinatura" :color="(row as any).assinado ? 'success' : 'warning'" :icon="(row as any).assinado ? 'i-lucide-shield-check' : 'i-lucide-shield-alert'" variant="soft" size="sm" />
          </Transition>
        </template>
        <template #cell-failed_attempts_count="{ row }">
          <span class="font-mono text-xs" :class="(row as any).failed_attempts_count ? 'text-error' : 'text-muted'">{{ (row as any).failed_attempts_count }}</span>
        </template>
        <template #cell-is_active="{ row }">
          <UBadge :label="(row as any).is_active ? tw.ativo : tw.pausado" :color="(row as any).is_active ? 'success' : 'neutral'" variant="outline" size="sm" />
        </template>
      </EnTable>
    </div>

    <div v-else class="grid gap-4 p-6 animate-[entrada_.25s_ease-out] xl:grid-cols-[1fr_28rem]">
      <div class="space-y-4">
        <Regra :titulo="tw.exigir" icone="i-lucide-shield-check" :descricao="tw.exigirAjuda" :alterada="exigirRascunho !== exigir">
          <template #selos><UBadge v-if="marcarNovo" :label="t.casca.novo" size="sm" variant="soft" /></template>
          <USwitch v-model="exigirRascunho" :disabled="exigir" />
          <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
            <div v-if="exigirRascunho && !exigir" class="space-y-3 rounded-lg border border-warning/40 bg-warning/5 p-3">
              <p class="flex items-center gap-2 text-sm font-medium text-highlighted"><UIcon name="i-lucide-shield-alert" class="size-4 text-warning" />{{ tw.semSegredo(semSegredo.length) }}</p>
              <ul class="space-y-0.5 pl-6 text-xs text-muted">
                <li v-for="w in semSegredo" :key="w.id" class="truncate font-mono">{{ w.url }}</li>
              </ul>
              <URadioGroup
                v-if="semSegredo.length"
                v-model="tratamento"
                :legend="tw.oQueFazer"
                :items="(['gerar', 'pausar'] as const).map(v => ({ label: tw.opcoes[v], description: tw.opcoesAjuda[v], value: v }))"
              />
              <div class="flex justify-end gap-2">
                <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" size="sm" @click="exigirRascunho = false" />
                <UButton :label="t.comum.salvar" size="sm" :loading="aplicando" @click="aplicar" />
              </div>
            </div>
          </Transition>
        </Regra>
        <Regra :titulo="tw.formato" icone="i-lucide-file-signature">
          <ul class="space-y-1.5">
            <li v-for="f in tw.formatoItens" :key="f" class="flex items-start gap-2 text-sm text-toned"><UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-success" />{{ f }}</li>
          </ul>
        </Regra>
      </div>
      <section class="h-fit rounded-lg border border-default bg-default">
        <p class="border-b border-default px-4 py-2 text-xs font-semibold text-toned">{{ tw.exemplo }}</p>
        <pre class="overflow-x-auto p-4 font-mono text-[11px] leading-relaxed text-highlighted">{{ exemplo }}</pre>
      </section>
    </div>

    <!-- Detalhe do webhook -->
    <USlideover v-model:open="detalhe" :title="tw.detalhe" :description="aberto?.url" :ui="{ content: 'max-w-xl' }">
      <template #body>
        <div v-if="aberto" class="space-y-5">
          <section class="space-y-2">
            <h4 class="text-sm font-semibold text-highlighted">{{ tw.segredo }}</h4>
            <template v-if="aberto.assinado">
              <div class="flex items-center gap-2">
                <code class="min-w-0 flex-1 truncate rounded-md border border-default bg-elevated px-2 py-1.5 font-mono text-xs text-highlighted">{{ revelado ? 'whsec_MfKQ9r8GKYqrTwjUPD8ILPZIo2LaLaSw' : 'whsec_••••••••••••••••••••••••' }}</code>
                <UButton :label="revelado ? t.comum.ocultar : t.comum.mostrar" :icon="revelado ? 'i-lucide-eye-off' : 'i-lucide-eye'" size="sm" color="neutral" variant="outline" @click="revelado = !revelado" />
              </div>
              <p class="text-xs text-muted">{{ tw.criadoEm(data(aberto.segredoCriado, idioma)) }}</p>
              <UButton :label="tw.trocar" icon="i-lucide-refresh-cw" size="sm" color="neutral" variant="outline" @click="trocar = true" />
            </template>
            <template v-else>
              <UAlert icon="i-lucide-shield-alert" color="warning" variant="soft" :title="tw.semAssinatura" />
              <UButton :label="tw.gerar" icon="i-lucide-key-round" size="sm" @click="gerarSegredo" />
            </template>
          </section>
          <section class="space-y-2">
            <h4 class="text-sm font-semibold text-highlighted">{{ tw.entregas }}</h4>
            <div class="divide-y divide-default rounded-md border border-default">
              <div v-for="(e, i) in entregas" :key="i" class="flex items-center gap-3 px-3 py-2 text-sm">
                <UBadge :label="String(e.status)" :color="e.status === 200 ? 'success' : 'error'" variant="soft" size="sm" class="font-mono" />
                <code class="flex-1 font-mono text-xs text-toned">{{ e.evento }}</code>
                <span class="text-xs text-muted">{{ e.ms }} ms</span>
                <span class="w-20 text-right text-xs text-muted">{{ relativo(e.quando, idioma) }}</span>
              </div>
            </div>
          </section>
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="trocar" :title="tw.trocarTitulo">
      <template #body>
        <div class="space-y-3">
          <URadioGroup v-model="quando" :items="(['depois', 'ja'] as const).map(v => ({ label: tw.trocarOpcoes[v], value: v }))" />
          <p class="text-xs text-muted">{{ tw.trocarAjuda }}</p>
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="trocar = false" />
          <UButton :label="tw.trocar" @click="confirmarTroca" />
        </div>
      </template>
    </UModal>
  </div>
</template>

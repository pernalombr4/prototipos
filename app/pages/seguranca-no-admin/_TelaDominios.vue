<script setup lang="ts">
/**
 * Pedido 7: Identidade › Domínios. Tela nova.
 *
 * Hoje existe `allow_create_workspaces` em Configurações Gerais, marcado "sem
 * efeito" (develop, 2026-10-19), e vale para a instância inteira, não para um
 * domínio. Referências: Notion (verificar por TXT, "Browse workspaces" com as
 * contas de fora, "Workspace creation: Only workspace owners"), monday ("Claim
 * domain" com bloqueio de contas novas), Linear ("Disable new workspace
 * creation"). A tela separa "domínio verificado que trava" de "entrar sem
 * convite", que o mercado chama por nomes parecidos e o cliente confunde.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { contasDeFora, dominiosIniciais } from './mocks'
import type { ContaDeFora, Dominio } from './mocks'
import { data, numero, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const td = computed(() => props.t.dominios)

const dominios = useState<Dominio[]>('sa-dominios', () => structuredClone(dominiosIniciais))
const fora = useState<ContaDeFora[]>('sa-fora', () => structuredClone(contasDeFora))
const controles = useState('sa-dominios-controles', () => ({ bloquear: false, semConvite: false, criaWs: 'todos' as 'org' | 'todos' }))
const rascunho = reactive({ ...controles.value })
const alterada = computed(() => JSON.stringify(rascunho) !== JSON.stringify(controles.value))
const principal = computed(() => dominios.value.find(d => d.estado === 'verificado'))

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'dominio', label: td.value.col.dominio },
  { key: 'estado', label: td.value.col.estado },
  { key: 'metodo', label: td.value.col.metodo },
  { key: 'desde', label: td.value.col.desde },
  { key: 'pessoas', label: td.value.col.pessoas, align: 'right' },
])
const corDoEstado = { verificado: 'success', aguardando: 'warning', falhou: 'error' } as const

const verificando = ref<string | null>(null)
function verificar(d: Dominio) {
  verificando.value = d.dominio
  setTimeout(() => {
    d.estado = 'verificado'
    d.desde = new Date()
    verificando.value = null
    toast.add({ title: td.value.verificou(d.dominio), icon: 'i-lucide-badge-check', color: 'success' })
  }, 1400)
}

/* ---------- adicionar ---------- */
const novo = ref(false)
const novoDominio = ref('')
const registro = computed(() => `enspace-verificacao=${Array.from(novoDominio.value || 'x').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(16).padStart(8, '0')}a91f02c4`)
function adicionar() {
  const d = novoDominio.value.trim().toLowerCase()
  if (!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(d)) return
  dominios.value.push({ dominio: d, estado: 'aguardando', metodo: 'txt', registro: registro.value, desde: null, pessoas: 0 })
  novo.value = false
  novoDominio.value = ''
  toast.add({ title: td.value.adicionado(d), icon: 'i-lucide-globe', color: 'neutral' })
}

/* ---------- controles ---------- */
function salvar() {
  controles.value = { ...rascunho }
  toast.add({ title: td.value.salvo, icon: 'i-lucide-check', color: 'success' })
}

/* ---------- contas de fora ---------- */
const colunasFora = computed<EnTableColumn[]>(() => [
  { key: 'email', label: td.value.colFora.email },
  { key: 'workspacesProprios', label: td.value.colFora.ws },
  { key: 'criada', label: td.value.colFora.criada },
  { key: 'ultimoAcesso', label: td.value.colFora.acesso },
])
function trazer(lista: ContaDeFora[]) {
  const emails = lista.map(c => c.email)
  fora.value = fora.value.filter(c => !emails.includes(c.email))
  toast.add({ title: td.value.trouxe(emails.length), icon: 'i-lucide-building-2', color: 'success' })
}
</script>

<template>
  <div>
    <Cabecalho :titulo="td.titulo" :intro="td.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada || !principal" @click="salvar" />
        <UButton :label="td.adicionar" icon="i-lucide-plus" size="sm" color="neutral" variant="outline" @click="novo = true" />
      </template>
    </Cabecalho>

    <div class="space-y-6 p-6">
      <EnTable :columns="colunas" :rows="(dominios as unknown as Record<string, unknown>[])" :locale="idioma">
        <template #cell-dominio="{ row }"><span class="font-mono text-sm font-medium text-highlighted">{{ (row as any).dominio }}</span></template>
        <template #cell-estado="{ row }">
          <span class="flex items-center gap-2">
            <Transition mode="out-in" enter-active-class="transition duration-300" enter-from-class="opacity-0 scale-75">
              <UBadge :key="(row as any).estado" :label="td.estados[(row as any).estado as 'verificado']" :color="corDoEstado[(row as any).estado as 'verificado']" variant="soft" size="sm" :icon="(row as any).estado === 'verificado' ? 'i-lucide-badge-check' : 'i-lucide-clock'" />
            </Transition>
            <UButton v-if="(row as any).estado !== 'verificado'" :label="verificando === (row as any).dominio ? td.verificando : td.verificar" :loading="verificando === (row as any).dominio" size="xs" variant="outline" @click="verificar(row as any)" />
          </span>
          <code v-if="(row as any).estado !== 'verificado'" class="mt-1 block font-mono text-[10px] text-muted">TXT {{ (row as any).registro }}</code>
        </template>
        <template #cell-metodo><span class="text-sm text-toned">{{ td.metodo }}</span></template>
        <template #cell-desde="{ row }"><span class="text-sm text-toned">{{ (row as any).desde ? data((row as any).desde, idioma) : '-' }}</span></template>
        <template #cell-pessoas="{ row }"><span class="font-mono text-xs text-toned">{{ numero((row as any).pessoas, idioma) }}</span></template>
      </EnTable>

      <!-- Controles do domínio -->
      <section class="space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-sm font-semibold text-highlighted">{{ principal ? td.controles(principal.dominio) : td.precisaVerificar }}</h2>
          <UBadge :label="td.vigencia" icon="i-lucide-zap" color="info" variant="soft" size="sm" />
        </div>
        <div class="grid gap-4 lg:grid-cols-3" :class="principal ? '' : 'pointer-events-none opacity-50'">
          <Regra :titulo="td.bloquear" icone="i-lucide-shield-ban" :descricao="td.bloquearAjuda(principal?.dominio ?? '')" :alterada="rascunho.bloquear !== controles.bloquear">
            <USwitch :aria-label="td.bloquear" v-model="rascunho.bloquear" />
          </Regra>
          <Regra :titulo="td.semConvite" icone="i-lucide-door-open" :descricao="td.semConviteAjuda" :alterada="rascunho.semConvite !== controles.semConvite">
            <USwitch :aria-label="td.semConvite" v-model="rascunho.semConvite" />
          </Regra>
          <Regra :titulo="td.criaWs" icone="i-lucide-briefcase" :alterada="rascunho.criaWs !== controles.criaWs">
            <USelect v-model="rascunho.criaWs" :items="(['org', 'todos'] as const).map(v => ({ label: td.criaWsOpcoes[v], value: v }))" class="w-full" />
          </Regra>
        </div>
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
          <UAlert v-if="rascunho.bloquear && fora.length" icon="i-lucide-triangle-alert" color="warning" variant="soft" :description="td.foraAviso(fora.length)" />
        </Transition>
      </section>

      <!-- Contas de fora -->
      <section class="space-y-2">
        <div class="flex flex-wrap items-center gap-2">
          <div>
            <h2 class="text-sm font-semibold text-highlighted">{{ td.fora }} <span class="font-mono text-xs text-muted">{{ fora.length }}</span></h2>
            <p class="text-xs text-muted">{{ td.foraAjuda }}</p>
          </div>
          <UButton v-if="fora.length" :label="td.trazerTodas" icon="i-lucide-building-2" size="xs" color="neutral" variant="outline" class="ml-auto" @click="trazer(fora)" />
        </div>
        <EnTable :columns="colunasFora" :rows="(fora as unknown as Record<string, unknown>[])" :locale="idioma" :empty-state="{ icon: 'i-lucide-badge-check', title: td.foraVazio }">
          <template #cell-email="{ row }"><span class="text-sm text-highlighted">{{ (row as any).email }}</span></template>
          <template #cell-workspacesProprios="{ row }">
            <span class="flex flex-wrap gap-1"><UBadge v-for="w in (row as any).workspacesProprios" :key="w" :label="w" color="neutral" variant="outline" size="sm" /></span>
          </template>
          <template #cell-criada="{ row }"><span class="text-sm text-toned">{{ data((row as any).criada, idioma) }}</span></template>
          <template #cell-ultimoAcesso="{ row }"><span class="text-sm text-toned">{{ relativo((row as any).ultimoAcesso, idioma) }}</span></template>
          <template #actions="{ row }">
            <UTooltip :text="td.trazer">
              <UButton icon="i-lucide-building-2" size="xs" variant="ghost" :aria-label="td.trazer" @click="trazer([row as any])" />
            </UTooltip>
          </template>
        </EnTable>
      </section>
    </div>

    <UModal v-model:open="novo" :title="td.novoTitulo">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="td.novoDominio">
            <UInput v-model="novoDominio" :placeholder="td.novoPh" class="w-full" autofocus :ui="{ base: 'font-mono' }" />
          </UFormField>
          <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-y-1">
            <div v-if="novoDominio.includes('.')" class="space-y-2 rounded-lg border border-default bg-elevated/50 p-3">
              <p class="text-sm text-toned">{{ td.passo }}</p>
              <dl class="grid grid-cols-[4rem_1fr] gap-y-1 text-xs">
                <dt class="text-muted">{{ td.nomeRegistro }}</dt><dd class="font-mono text-highlighted">@</dd>
                <dt class="text-muted">{{ td.valorRegistro }}</dt><dd class="break-all font-mono text-highlighted">{{ registro }}</dd>
              </dl>
            </div>
          </Transition>
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="novo = false" />
          <UButton :label="t.comum.adicionar" :disabled="!/^[a-z0-9-]+(\.[a-z0-9-]+)+$/i.test(novoDominio.trim())" @click="adicionar" />
        </div>
      </template>
    </UModal>
  </div>
</template>

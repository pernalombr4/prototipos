<script setup lang="ts">
/**
 * Pedido 2: Integrações › Tokens de API. Tela nova.
 *
 * Hoje cada pessoa vê só os próprios tokens, dentro do workspace, e o token pode
 * nascer sem validade (`expires_at` é opcional no schema `ApiKey`).
 * Referências: GitHub ("Active tokens" + política de validade máxima com 3
 * estados), Atlassian ("API token activity" com revogação em lote) e Entra
 * ("Restrict max lifetime", "Block addition"). O que ninguém faz e entra aqui:
 * aviso ao admin antes de expirar e a escolha do que fazer com os tokens que
 * ficam fora quando a política aperta.
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { AGORA, DIA, daqui, nomeDoWorkspace } from './mocks'
import type { TokenDaOrg } from './mocks'
import { data, diasAte, relativo } from './apoio'
import { usePoliticaDeTokens, useTokens } from './estado'
import type { PoliticaDeTokens } from './estado'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const tt = computed(() => props.t.tokens)
const tp = computed(() => props.t.tokens.politica)

const tokens = useTokens()
const politica = usePoliticaDeTokens()
const comPrazo = useState<number[]>('sa-tokens-prazo', () => [])
const aba = ref<'lista' | 'politica'>('lista')

/* ---------- estado de cada token ---------- */
type Estado = 'ativo' | 'expirando' | 'fora' | 'revogado' | 'expirado'
function acimaDoTeto(k: TokenDaOrg, teto: number) {
  if (!teto) return false
  return !k.expires_at || diasAte(k.expires_at) > teto
}
function estado(k: TokenDaOrg): Estado {
  if (k.status === 'inactive') return 'revogado'
  if (k.expires_at && new Date(k.expires_at) < AGORA) return 'expirado'
  if (politica.value.tratamento && politica.value.tratamento !== 'prazo' && acimaDoTeto(k, politica.value.validadeMax)) return 'fora'
  if (k.expires_at && diasAte(k.expires_at) <= 7) return 'expirando'
  return 'ativo'
}
const corDoEstado: Record<Estado, 'success' | 'warning' | 'error' | 'neutral'> = { ativo: 'success', expirando: 'warning', fora: 'error', revogado: 'neutral', expirado: 'neutral' }

/* ---------- resumo e filtros ---------- */
type Atalho = 'ativos' | 'semValidade' | 'expirando' | 'parados'
const atalho = ref<Atalho | null>(null)
const busca = ref('')
const filtroEstado = ref<Estado | 'todos'>('todos')
const vivos = computed(() => tokens.value.filter(k => k.status === 'active' && !(k.expires_at && new Date(k.expires_at) < AGORA)))
const resumo = computed(() => ({
  ativos: vivos.value.length,
  semValidade: vivos.value.filter(k => !k.expires_at).length,
  expirando: vivos.value.filter(k => k.expires_at && diasAte(k.expires_at) <= 7).length,
  parados: vivos.value.filter(k => !k.ultimo_uso || (AGORA.getTime() - new Date(k.ultimo_uso).getTime()) > 90 * DIA).length,
}))
const filtrados = computed(() => {
  const q = busca.value.trim().toLowerCase()
  return tokens.value.filter((k) => {
    if (q && !`${k.description} ${k.dono.nome}`.toLowerCase().includes(q)) return false
    if (filtroEstado.value !== 'todos' && estado(k) !== filtroEstado.value) return false
    if (atalho.value === 'ativos' && !vivos.value.includes(k)) return false
    if (atalho.value === 'semValidade' && !(vivos.value.includes(k) && !k.expires_at)) return false
    if (atalho.value === 'expirando' && !(vivos.value.includes(k) && k.expires_at && diasAte(k.expires_at) <= 7)) return false
    if (atalho.value === 'parados' && !(vivos.value.includes(k) && (!k.ultimo_uso || (AGORA.getTime() - new Date(k.ultimo_uso).getTime()) > 90 * DIA))) return false
    return true
  })
})
const itensEstado = computed(() => [{ label: tt.value.todosEstados, value: 'todos' }, ...(['ativo', 'expirando', 'fora', 'revogado', 'expirado'] as const).map(e => ({ label: tt.value.estados[e], value: e }))])

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'description', label: tt.value.col.nome },
  { key: 'dono', label: tt.value.col.dono },
  { key: 'scope', label: tt.value.col.workspaces },
  { key: 'permissoes', label: tt.value.col.permissoes },
  { key: 'ultimo_uso', label: tt.value.col.uso },
  { key: 'expires_at', label: tt.value.col.expira },
  { key: 'estado', label: tt.value.col.estado },
])
const linhas = computed(() => filtrados.value as unknown as Record<string, unknown>[])
const selecionados = ref<Record<string, unknown>[]>([])
const sel = computed(() => selecionados.value as unknown as TokenDaOrg[])

/* ---------- revogar ---------- */
const confirmar = ref(false)
const alvo = ref<TokenDaOrg[]>([])
const revogando = ref(false)
function pedirRevogar(lista: TokenDaOrg[]) {
  alvo.value = lista.filter(k => k.status === 'active')
  if (alvo.value.length) confirmar.value = true
}
function revogar() {
  revogando.value = true
  setTimeout(() => {
    for (const k of alvo.value) k.status = 'inactive'
    toast.add({ title: tt.value.revogados(alvo.value.length), icon: 'i-lucide-key-round', color: 'success' })
    selecionados.value = []
    revogando.value = false
    confirmar.value = false
  }, 700)
}

/* ---------- política ---------- */
const rascunho = reactive<PoliticaDeTokens>(structuredClone(toRaw(politica.value)))
const alterada = computed(() => JSON.stringify({ ...rascunho, tratamento: null }) !== JSON.stringify({ ...politica.value, tratamento: null }))
watch(() => rascunho.validadeMax, (v) => { if (v) rascunho.proibirSemValidade = true })
const itensValidade = computed(() => [30, 60, 90, 180, 365, 0].map(v => ({ label: tp.value.opcoes[v], value: v })))
const itensQuem = computed(() => (['todos', 'ws', 'org'] as const).map(v => ({ label: tp.value.quemOpcoes[v], value: v })))
const itensAviso = computed(() => [30, 7, 1].map(v => ({ label: tp.value.avisoOpcoes[v], value: v })))

const opcoesNoDialogo = computed(() => {
  const base = [30, 60, 90, 180, 365].filter(v => !rascunho.validadeMax || v <= rascunho.validadeMax).map(v => tp.value.opcoes[v]!)
  return rascunho.proibirSemValidade ? base : [...base, tt.value.semValidade]
})
const previaValor = ref('')
watch(opcoesNoDialogo, (o) => { if (!o.includes(previaValor.value)) previaValor.value = o[Math.min(2, o.length - 1)] ?? '' }, { immediate: true })

const foraDaNova = computed(() => tokens.value.filter(k => k.status === 'active' && (rascunho.proibirSemValidade && !k.expires_at || acimaDoTeto(k, rascunho.validadeMax))))
const impacto = ref(false)
const tratamento = ref<'prazo' | 'bloquear' | 'registrar'>('prazo')
function aplicar() {
  if (foraDaNova.value.length) {
    impacto.value = true
    return
  }
  gravar(null)
}
function gravar(tr: PoliticaDeTokens['tratamento']) {
  if (tr === 'prazo') {
    for (const k of foraDaNova.value) {
      k.expires_at = daqui(30 * DIA)
      comPrazo.value.push(k.id)
    }
  }
  politica.value = { ...structuredClone(toRaw(rascunho)), tratamento: tr }
  impacto.value = false
  toast.add({ title: tp.value.aplicada, icon: 'i-lucide-check', color: 'success' })
}
</script>

<template>
  <div>
    <Cabecalho :titulo="tt.titulo" :intro="tt.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template v-if="aba === 'politica'" #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.descartar" size="sm" color="neutral" variant="ghost" :disabled="!alterada" @click="Object.assign(rascunho, structuredClone(toRaw(politica)))" />
        <UButton :label="tp.aplicar" size="sm" :disabled="!alterada" @click="aplicar" />
      </template>
    </Cabecalho>

    <div class="px-6 pt-3">
      <UTabs
        v-model="aba"
        :items="[{ label: tt.abaLista, value: 'lista', icon: 'i-lucide-list' }, { label: tt.abaPolitica, value: 'politica', icon: 'i-lucide-shield-check' }]"
        variant="link"
        :content="false"
        size="sm"
      />
    </div>

    <!-- LISTA -->
    <div v-if="aba === 'lista'" class="space-y-4 p-6 animate-[entrada_.25s_ease-out]">
      <div class="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          v-for="(k, i) in (['ativos', 'semValidade', 'expirando', 'parados'] as const)"
          :key="k"
          type="button"
          class="animate-[entrada_.3s_ease-out_both] rounded-lg border p-3 text-left transition hover:-translate-y-0.5 hover:shadow-sm"
          :class="atalho === k ? 'border-primary bg-primary/5' : 'border-default bg-default'"
          :style="{ animationDelay: `${i * 50}ms` }"
          :aria-pressed="atalho === k"
          @click="atalho = atalho === k ? null : k"
        >
          <p class="text-xs text-muted">{{ tt.resumo[k] }}</p>
          <p class="mt-1 text-2xl font-semibold" :class="k === 'semValidade' && resumo[k] ? 'text-warning' : 'text-highlighted'">{{ resumo[k] }}</p>
        </button>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <UInput v-model="busca" :placeholder="tt.buscar" icon="i-lucide-search" size="sm" class="w-64" />
        <USelect v-model="filtroEstado" :items="itensEstado" size="sm" class="w-48" />
        <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 translate-x-2" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <div v-if="sel.length" class="ml-auto flex items-center gap-2 rounded-md bg-elevated px-3 py-1">
            <span class="text-sm text-highlighted">{{ tt.selecionados(sel.length) }}</span>
            <UButton :label="tt.revogar" icon="i-lucide-ban" size="xs" color="error" @click="pedirRevogar(sel)" />
          </div>
        </Transition>
      </div>

      <EnTable
        v-model:selected="selecionados"
        :columns="colunas"
        :rows="linhas"
        :locale="idioma"
        selectable
        :empty-state="{ icon: 'i-lucide-key-round', title: tt.vazioTitulo, description: tt.vazio }"
      >
        <template #cell-description="{ row }">
          <span class="leading-tight">
            <span class="block text-sm font-medium text-highlighted">{{ (row as any).description }}</span>
            <span class="block font-mono text-[10px] text-muted">{{ (row as any).reference }}</span>
          </span>
        </template>
        <template #cell-dono="{ row }">
          <span class="flex items-center gap-1.5">
            <UIcon :name="(row as any).dono.tipo === 'conta' ? 'i-lucide-bot-message-square' : 'i-lucide-user-round'" class="size-3.5 text-muted" />
            <span class="text-sm text-toned">{{ (row as any).dono.nome }}</span>
            <UBadge v-if="(row as any).dono.tipo === 'conta'" :label="tt.contaDeServico" size="sm" variant="soft" color="info" />
          </span>
        </template>
        <template #cell-scope="{ row }">
          <span class="flex flex-wrap gap-1">
            <UBadge v-for="w in ((row as any).scope?.workspaces ?? []).slice(0, 2)" :key="w" :label="nomeDoWorkspace(w)" color="neutral" variant="outline" size="sm" class="max-w-36 truncate" />
            <UBadge v-if="((row as any).scope?.workspaces ?? []).length > 2" :label="`+${(row as any).scope.workspaces.length - 2}`" color="neutral" variant="soft" size="sm" />
          </span>
        </template>
        <template #cell-permissoes="{ row }">
          <span class="text-xs text-toned">{{ ((row as any).scope?.global ?? []).map((p: 'read' | 'write' | 'delete') => tt.permissoes[p]).join(', ') }}</span>
        </template>
        <template #cell-ultimo_uso="{ row }">
          <span class="whitespace-nowrap text-sm" :class="(row as any).ultimo_uso ? 'text-toned' : 'text-muted'">{{ (row as any).ultimo_uso ? relativo((row as any).ultimo_uso, idioma) : tt.nuncaUsado }}</span>
        </template>
        <template #cell-expires_at="{ row }">
          <span v-if="!(row as any).expires_at" class="flex items-center gap-1 whitespace-nowrap text-sm text-warning"><UIcon name="i-lucide-infinity" class="size-4" />{{ tt.semValidade }}</span>
          <span v-else class="leading-tight">
            <span class="block whitespace-nowrap text-sm text-toned">{{ data((row as any).expires_at, idioma) }}</span>
            <span v-if="comPrazo.includes((row as any).id)" class="block text-[10px] text-warning">{{ tt.prazoDaPolitica(relativo((row as any).expires_at, idioma)) }}</span>
          </span>
        </template>
        <template #cell-estado="{ row }">
          <UBadge :label="tt.estados[estado(row as any)]" :color="corDoEstado[estado(row as any)]" variant="soft" size="sm" />
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="[[{ label: tt.revogar, icon: 'i-lucide-ban', color: 'error', disabled: (row as any).status !== 'active', onSelect: () => pedirRevogar([row as any]) }, { label: t.comum.verRegistro, icon: 'i-lucide-scroll-text' }]]">
            <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" :aria-label="tt.revogar" />
          </UDropdownMenu>
        </template>
      </EnTable>
    </div>

    <!-- POLÍTICA -->
    <div v-else class="grid gap-4 p-6 animate-[entrada_.25s_ease-out] xl:grid-cols-[1fr_22rem]">
      <div class="grid gap-4 md:grid-cols-2">
        <Regra :titulo="tp.validade" icone="i-lucide-hourglass" :descricao="tp.validadeAjuda" :alterada="rascunho.validadeMax !== politica.validadeMax">
          <USelect v-model="rascunho.validadeMax" :items="itensValidade" class="w-48" />
        </Regra>
        <Regra :titulo="tp.semValidade" icone="i-lucide-infinity" :descricao="tp.semValidadeAjuda" :alterada="rascunho.proibirSemValidade !== politica.proibirSemValidade">
          <USwitch :aria-label="tp.semValidade" v-model="rascunho.proibirSemValidade" :disabled="!!rascunho.validadeMax" />
        </Regra>
        <Regra :titulo="tp.quemCria" icone="i-lucide-user-cog" :alterada="rascunho.quemCria !== politica.quemCria">
          <USelect v-model="rascunho.quemCria" :items="itensQuem" class="w-full max-w-72" />
        </Regra>
        <Regra :titulo="tp.aprovacao" icone="i-lucide-stamp" :descricao="tp.aprovacaoAjuda" :alterada="rascunho.aprovacao !== politica.aprovacao">
          <USwitch :aria-label="tp.aprovacao" v-model="rascunho.aprovacao" />
        </Regra>
        <Regra :titulo="tp.aviso" icone="i-lucide-bell-ring" :descricao="tp.avisoAjuda" :alterada="JSON.stringify(rascunho.avisos) !== JSON.stringify(politica.avisos)" class="md:col-span-2">
          <UCheckboxGroup v-model="rascunho.avisos" :items="itensAviso" orientation="horizontal" />
        </Regra>
      </div>

      <!-- Prévia do diálogo de criar token -->
      <aside class="h-fit rounded-lg border border-dashed border-accented bg-elevated/50 p-4">
        <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">{{ tp.previa }}</p>
        <div class="space-y-3 rounded-lg border border-default bg-default p-4 shadow-sm">
          <UFormField :label="tt.col.nome"><UInput model-value="Integração de BI" disabled class="w-full" /></UFormField>
          <UFormField :label="tp.previaValidade">
            <USelect v-model="previaValor" :items="opcoesNoDialogo" class="w-full" />
          </UFormField>
          <TransitionGroup tag="div" class="flex flex-wrap gap-1" enter-active-class="transition duration-200" enter-from-class="opacity-0 scale-90" leave-active-class="transition duration-150 absolute" leave-to-class="opacity-0 scale-90">
            <UBadge v-for="o in opcoesNoDialogo" :key="o" :label="o" size="sm" :color="o === tt.semValidade ? 'warning' : 'neutral'" variant="outline" />
          </TransitionGroup>
          <UFormField v-if="rascunho.aprovacao" :label="tp.aprovacao" class="animate-[entrada_.2s_ease-out]">
            <UTextarea :placeholder="tp.aprovacaoAjuda" :rows="2" disabled class="w-full" />
          </UFormField>
        </div>
      </aside>
    </div>

    <!-- Confirmar revogação -->
    <UModal v-model:open="confirmar" :title="tt.revogarTitulo(alvo.length)" :description="tt.revogarTexto">
      <template #body>
        <ul class="max-h-48 space-y-1 overflow-y-auto text-sm">
          <li v-for="k in alvo" :key="k.id" class="flex items-center gap-2">
            <UIcon name="i-lucide-key-round" class="size-3.5 text-muted" />
            <span class="text-highlighted">{{ k.description }}</span>
            <span class="text-muted">· {{ k.dono.nome }}</span>
          </li>
        </ul>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="confirmar = false" />
          <UButton :label="tt.revogarBotao(alvo.length)" color="error" :loading="revogando" @click="revogar" />
        </div>
      </template>
    </UModal>

    <!-- Impacto da política -->
    <UModal v-model:open="impacto" :title="tp.impactoTitulo(foraDaNova.length)">
      <template #body>
        <div class="space-y-4">
          <div class="flex flex-wrap gap-2">
            <UBadge :label="tp.impactoSem(foraDaNova.filter(k => !k.expires_at).length)" color="warning" variant="soft" icon="i-lucide-infinity" />
            <UBadge v-if="rascunho.validadeMax" :label="tp.impactoAcima(foraDaNova.filter(k => k.expires_at).length, tp.opcoes[rascunho.validadeMax]!)" color="warning" variant="soft" icon="i-lucide-hourglass" />
          </div>
          <ul class="max-h-36 space-y-1 overflow-y-auto rounded-md border border-default p-2 text-sm">
            <li v-for="k in foraDaNova" :key="k.id" class="flex items-center gap-2">
              <span class="text-highlighted">{{ k.description }}</span>
              <span class="text-muted">· {{ k.dono.nome }} · {{ k.expires_at ? data(k.expires_at, idioma) : tt.semValidade }}</span>
            </li>
          </ul>
          <URadioGroup
            v-model="tratamento"
            :legend="tp.impactoPergunta"
            :items="(['prazo', 'bloquear', 'registrar'] as const).map(v => ({ label: tp.impactoOpcoes[v], description: tp.impactoAjuda[v], value: v }))"
          />
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="impacto = false" />
          <UButton :label="tp.aplicar" :color="tratamento === 'bloquear' ? 'error' : 'primary'" @click="gravar(tratamento)" />
        </div>
      </template>
    </UModal>
  </div>
</template>

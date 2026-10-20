<script setup lang="ts">
/**
 * Identidade › Administradores. Tela nova, fora dos 10 pedidos: pedido da redatora
 * na rodada 4 ("deve haver espaço pra definir quem sao os ADMINISTRADORES DA
 * ORGANIZAÇAO (quem tem acesso ao admin)").
 *
 * Hoje o admin só tem o perfil interno "Admin" da equipe ENSPACE; não há tela para
 * o cliente dizer quem acessa o admin da organização dele.
 * Referências: Atlassian (organization admin e user access admin por app), Notion
 * (organization owner, workspace owner e papéis delegados como membership admin),
 * Slack (primary owner, owners, admins), GitHub (enterprise owner e billing manager),
 * monday (papéis personalizados com privilégios de admin) e Google Workspace (super
 * admin restrito a poucas pessoas, papéis prontos por função).
 */
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import Regra from './_Regra.vue'
import { DIA, administradoresIniciais, daqui, nomeDoWorkspace, permissoesDoPapel, pessoas, workspaces } from './mocks'
import type { Administrador, AreaDoAdmin, Nivel, PapelDeAdmin } from './mocks'
import { data, relativo } from './apoio'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const ta = computed(() => props.t.admins)

const admins = useState<Administrador[]>('sa-admins', () => structuredClone(administradoresIniciais))
const aba = ref<'lista' | 'papeis'>('lista')
const papeis: PapelDeAdmin[] = ['dono', 'seguranca', 'pessoas', 'auditor', 'financeiro']
const areas: AreaDoAdmin[] = ['admins', 'identidade', 'integracoes', 'ia', 'protecao', 'logs', 'financeiro']
const corDoPapel: Record<PapelDeAdmin, 'primary' | 'info' | 'success' | 'neutral' | 'warning'> = { dono: 'primary', seguranca: 'info', pessoas: 'success', auditor: 'neutral', financeiro: 'warning' }

/* ---------- regras de acesso (rascunho com Salvar no cabeçalho) ---------- */
const regras = useState('sa-admins-regras', () => ({ exigirFator: false, suporte: 'aprovacao' as 'bloqueado' | 'aprovacao' | 'liberado' }))
const rascunho = reactive({ ...regras.value })
const alterada = computed(() => JSON.stringify(rascunho) !== JSON.stringify(regras.value))
function salvar() {
  regras.value = { ...rascunho }
  toast.add({ title: props.t.comum.salvo, icon: 'i-lucide-check', color: 'success' })
}

/* ---------- avisos ---------- */
const donos = computed(() => admins.value.filter(a => a.papel === 'dono' && a.estado === 'ativo'))
const semFator = computed(() => admins.value.filter(a => a.estado === 'ativo' && !a.segundoFator))

/* ---------- lista ---------- */
const colunas = computed<EnTableColumn[]>(() => [
  { key: 'pessoa', label: ta.value.col.pessoa },
  { key: 'papel', label: ta.value.col.papel },
  { key: 'alcance', label: ta.value.col.alcance },
  { key: 'segundoFator', label: ta.value.col.fator },
  { key: 'origem', label: ta.value.col.origem },
  { key: 'ultimoAcesso', label: ta.value.col.acesso },
])
const itensPapel = computed(() => papeis.map(p => ({ label: ta.value.papeis[p].nome, value: p, ajuda: ta.value.papeis[p].ajuda })))
const ehUltimoDono = (a: Administrador) => a.papel === 'dono' && donos.value.length <= 1

function mudarPapel(a: Administrador, p: PapelDeAdmin) {
  if (p === a.papel) return
  if (ehUltimoDono(a)) {
    toast.add({ title: ta.value.ultimoDono, icon: 'i-lucide-triangle-alert', color: 'warning' })
    return
  }
  a.papel = p
  if (p !== 'pessoas') a.alcance = null
  toast.add({ title: ta.value.papelMudou(a.pessoa.nome, ta.value.papeis[p].nome), icon: 'i-lucide-user-cog', color: 'success' })
}

const removendo = ref<Administrador | null>(null)
const confirmar = computed({ get: () => !!removendo.value, set: (v) => { if (!v) removendo.value = null } })
function remover() {
  const a = removendo.value
  if (!a) return
  admins.value = admins.value.filter(x => x.id !== a.id)
  toast.add({ title: ta.value.removido(a.pessoa.nome), icon: 'i-lucide-user-minus', color: 'success' })
  removendo.value = null
}
function menuDe(a: Administrador) {
  return [[
    ...(a.estado === 'pendente' ? [{ label: ta.value.reenviar, icon: 'i-lucide-mail', onSelect: () => toast.add({ title: ta.value.reenviado, icon: 'i-lucide-mail', color: 'neutral' }) }] : []),
    { label: props.t.comum.verRegistro, icon: 'i-lucide-scroll-text' },
    {
      label: ta.value.remover,
      icon: 'i-lucide-user-minus',
      color: 'error' as const,
      disabled: ehUltimoDono(a) || a.origem === 'entra',
      description: ehUltimoDono(a) ? ta.value.ultimoDono : a.origem === 'entra' ? ta.value.origemAjuda : undefined,
      onSelect: () => { removendo.value = a },
    },
  ]]
}

/* ---------- matriz de papéis ---------- */
const colunasMatriz = computed<EnTableColumn[]>(() => [
  { key: 'area', label: '' },
  ...papeis.map(p => ({ key: p, label: ta.value.papeis[p].nome, align: 'center' as const })),
])
const linhasMatriz = computed(() => areas.map(ar => ({ area: ar, ...Object.fromEntries(papeis.map(p => [p, permissoesDoPapel[p][ar]])) })) as unknown as Record<string, unknown>[])
const iconeDoNivel: Record<Nivel, string> = { editar: 'i-lucide-pencil', ver: 'i-lucide-eye', nenhum: 'i-lucide-minus' }
const corDoNivel: Record<Nivel, string> = { editar: 'text-success', ver: 'text-info', nenhum: 'text-muted' }

/* ---------- adicionar ---------- */
const novo = ref(false)
const enviando = ref(false)
const form = reactive({ email: '', papel: 'seguranca' as PapelDeAdmin, alcance: 'org' as 'org' | 'ws', workspaces: [] as string[], validade: 'sempre' as 'sempre' | '7' | '30' | '90' })
const candidatos = computed(() => pessoas.filter(p => !admins.value.some(a => a.pessoa.email === p.email)).map(p => ({ label: p.nome, value: p.email, description: p.email })))
function abrirNovo() {
  Object.assign(form, { email: '', papel: 'seguranca', alcance: 'org', workspaces: [], validade: 'sempre' })
  novo.value = true
}
watch(() => form.papel, (p) => { if (p !== 'pessoas') form.alcance = 'org' })
const podeEnviar = computed(() => !!form.email && (form.alcance === 'org' || form.workspaces.length > 0))
function enviar() {
  const pessoa = pessoas.find(p => p.email === form.email)
  if (!pessoa) return
  enviando.value = true
  setTimeout(() => {
    admins.value.push({
      id: `ad${Date.now()}`,
      pessoa,
      papel: form.papel,
      alcance: form.alcance === 'ws' ? [...form.workspaces] : null,
      origem: 'manual',
      segundoFator: false,
      estado: 'pendente',
      ultimoAcesso: null,
      expira: form.validade === 'sempre' ? null : daqui(Number(form.validade) * DIA),
    })
    enviando.value = false
    novo.value = false
    toast.add({ title: ta.value.novo.enviado(pessoa.nome), icon: 'i-lucide-mail-check', color: 'success' })
  }, 700)
}
</script>

<template>
  <div>
    <Cabecalho :titulo="ta.titulo" :intro="ta.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span v-if="alterada" class="text-xs text-warning">{{ t.comum.pendentes(1) }}</span>
        <UButton :label="t.comum.salvar" size="sm" :disabled="!alterada" @click="salvar" />
        <UButton :label="ta.adicionar" icon="i-lucide-user-plus" size="sm" color="neutral" variant="outline" @click="abrirNovo" />
      </template>
    </Cabecalho>

    <div class="px-6 pt-3">
      <UTabs
        v-model="aba"
        :items="[{ label: `${ta.abaLista} (${admins.length})`, value: 'lista', icon: 'i-lucide-users' }, { label: ta.abaPapeis, value: 'papeis', icon: 'i-lucide-table-2' }]"
        variant="link"
        :content="false"
        size="sm"
      />
    </div>

    <!-- LISTA -->
    <div v-if="aba === 'lista'" class="space-y-4 p-6 animate-[entrada_.25s_ease-out]">
      <TransitionGroup tag="div" class="space-y-2" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition duration-150" leave-to-class="opacity-0">
        <UAlert v-if="donos.length < 2" key="donos" icon="i-lucide-users-round" color="warning" variant="soft" :description="ta.poucosDonos" />
        <UAlert v-if="semFator.length" key="fator" icon="i-lucide-shield-alert" color="warning" variant="subtle" :description="ta.semFator(semFator.length)" />
      </TransitionGroup>

      <EnTable :columns="colunas" :rows="(admins as unknown as Record<string, unknown>[])" :locale="idioma">
        <template #cell-pessoa="{ row }">
          <span class="flex items-center gap-2">
            <UAvatar :alt="(row as any).pessoa.nome" size="sm" />
            <span class="min-w-0 leading-tight">
              <span class="flex items-center gap-1.5 text-sm font-medium text-highlighted">
                {{ (row as any).pessoa.nome }}
                <UBadge v-if="(row as any).voce" :label="ta.voce" size="sm" color="neutral" variant="outline" />
                <UBadge v-if="(row as any).estado === 'pendente'" :label="ta.pendente" size="sm" color="warning" variant="soft" />
              </span>
              <span class="block truncate text-xs text-muted">{{ (row as any).pessoa.email }}</span>
              <span v-if="(row as any).expira" class="flex items-center gap-1 text-[11px] text-warning"><UIcon name="i-lucide-hourglass" class="size-3" />{{ ta.expira(data((row as any).expira, idioma)) }}</span>
            </span>
          </span>
        </template>
        <template #cell-papel="{ row }">
          <UTooltip :text="(row as any).origem === 'entra' ? ta.origemAjuda : ''" :disabled="(row as any).origem !== 'entra'">
            <USelect
              :model-value="(row as any).papel"
              :items="itensPapel"
              size="xs"
              class="w-56"
              :color="corDoPapel[(row as any).papel as PapelDeAdmin]"
              variant="soft"
              :disabled="(row as any).origem === 'entra'"
              :aria-label="`${ta.mudarPapel}: ${(row as any).pessoa.nome}`"
              @update:model-value="(p: PapelDeAdmin) => mudarPapel(row as any, p)"
            />
          </UTooltip>
        </template>
        <template #cell-alcance="{ row }">
          <span v-if="!(row as any).alcance" class="text-sm text-toned">{{ ta.todaOrg }}</span>
          <UTooltip v-else :text="(row as any).alcance.map(nomeDoWorkspace).join(', ')">
            <UBadge :label="ta.alcanceN((row as any).alcance.length)" color="neutral" variant="outline" size="sm" icon="i-lucide-briefcase" />
          </UTooltip>
        </template>
        <template #cell-segundoFator="{ row }">
          <UBadge
            :label="(row as any).segundoFator ? ta.fatorAtivo : ta.fatorPendente"
            :color="(row as any).segundoFator ? 'success' : (regras.exigirFator ? 'error' : 'warning')"
            :icon="(row as any).segundoFator ? 'i-lucide-shield-check' : 'i-lucide-shield-alert'"
            variant="soft"
            size="sm"
          />
        </template>
        <template #cell-origem="{ row }">
          <span class="flex items-center gap-1.5 text-sm text-toned">
            <UIcon :name="(row as any).origem === 'entra' ? 'i-lucide-refresh-cw' : 'i-lucide-user-plus'" class="size-3.5 text-muted" />
            {{ ta.origens[(row as any).origem as 'manual' | 'entra'] }}
          </span>
        </template>
        <template #cell-ultimoAcesso="{ row }">
          <span class="whitespace-nowrap text-sm" :class="(row as any).ultimoAcesso ? 'text-toned' : 'text-muted'">{{ (row as any).ultimoAcesso ? relativo((row as any).ultimoAcesso, idioma) : ta.nuncaAcessou }}</span>
        </template>
        <template #actions="{ row }">
          <UDropdownMenu :items="menuDe(row as any)">
            <UButton icon="i-lucide-ellipsis-vertical" size="xs" color="neutral" variant="ghost" :aria-label="ta.remover" />
          </UDropdownMenu>
        </template>
      </EnTable>

      <section class="space-y-3">
        <h2 class="text-sm font-semibold text-highlighted">{{ ta.politicaTitulo }}</h2>
        <div class="grid gap-4 lg:grid-cols-2">
          <Regra :titulo="ta.exigirFator" icone="i-lucide-shield-check" :descricao="ta.exigirFatorAjuda" :alterada="rascunho.exigirFator !== regras.exigirFator">
            <USwitch v-model="rascunho.exigirFator" :aria-label="ta.exigirFator" />
          </Regra>
          <Regra :titulo="ta.suporte" icone="i-lucide-headset" :descricao="ta.suporteAjuda" :alterada="rascunho.suporte !== regras.suporte">
            <USelect v-model="rascunho.suporte" :items="(['bloqueado', 'aprovacao', 'liberado'] as const).map(v => ({ label: ta.suporteOpcoes[v], value: v }))" class="w-full max-w-80" :aria-label="ta.suporte" />
          </Regra>
        </div>
      </section>
    </div>

    <!-- PAPÉIS -->
    <div v-else class="space-y-4 p-6 animate-[entrada_.25s_ease-out]">
      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div v-for="(p, i) in papeis" :key="p" class="animate-[entrada_.3s_ease-out_both] rounded-lg border border-default bg-default p-3" :style="{ animationDelay: `${i * 50}ms` }">
          <UBadge :label="ta.papeis[p].nome" :color="corDoPapel[p]" variant="soft" />
          <p class="mt-2 text-xs text-muted">{{ ta.papeis[p].ajuda }}</p>
          <p class="mt-2 text-xs text-toned">{{ ta.comPapel(admins.filter(a => a.papel === p).length) }}</p>
        </div>
      </div>
      <EnTable :columns="colunasMatriz" :rows="linhasMatriz" :locale="idioma">
        <template #cell-area="{ row }"><span class="text-sm font-medium text-highlighted">{{ ta.areas[(row as any).area as AreaDoAdmin] }}</span></template>
        <template v-for="p in papeis" :key="p" #[`cell-${p}`]="{ row }">
          <span class="flex items-center justify-center gap-1 text-xs" :class="corDoNivel[(row as any)[p] as Nivel]">
            <UIcon :name="iconeDoNivel[(row as any)[p] as Nivel]" class="size-3.5" />
            {{ ta.niveis[(row as any)[p] as Nivel] }}
          </span>
        </template>
      </EnTable>
    </div>

    <!-- Remover -->
    <UModal v-model:open="confirmar" :title="removendo ? ta.removerTitulo(removendo.pessoa.nome) : ''" :description="ta.removerTexto">
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="removendo = null" />
          <UButton :label="ta.remover" color="error" @click="remover" />
        </div>
      </template>
    </UModal>

    <!-- Adicionar -->
    <USlideover v-model:open="novo" :title="ta.novo.titulo" :ui="{ content: 'max-w-lg' }">
      <template #body>
        <div class="space-y-4">
          <UFormField :label="ta.novo.pessoa" :help="ta.novo.pessoaAjuda" required>
            <USelectMenu v-model="form.email" :items="candidatos" value-key="value" :placeholder="ta.novo.pessoaPh" class="w-full" />
          </UFormField>
          <UFormField :label="ta.novo.papel" required>
            <USelect v-model="form.papel" :items="itensPapel" class="w-full">
              <template #item-trailing="{ item }">
                <UTooltip :text="(item as any).ajuda" :content="{ side: 'right', sideOffset: 12 }" :ui="{ content: 'h-auto max-w-72 py-1.5', text: 'whitespace-normal' }">
                  <UIcon name="i-lucide-circle-help" class="size-4 text-muted" :aria-label="ta.novo.ajudaDaOpcao" />
                </UTooltip>
              </template>
            </USelect>
            <template #help>{{ ta.papeis[form.papel].ajuda }}</template>
          </UFormField>
          <UFormField :label="ta.novo.alcance" :help="ta.novo.alcanceAjuda">
            <USelect v-model="form.alcance" :items="(['org', 'ws'] as const).map(v => ({ label: ta.novo.alcanceOpcoes[v], value: v }))" :disabled="form.papel !== 'pessoas'" class="w-full" />
          </UFormField>
          <Transition enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
            <div v-if="form.alcance === 'ws'">
              <USelectMenu v-model="form.workspaces" :items="workspaces.map(w => ({ label: w.name, value: w.reference }))" value-key="value" multiple :placeholder="ta.novo.workspacesPh" class="w-full" />
            </div>
          </Transition>
          <UFormField :label="ta.novo.validade" :help="ta.novo.validadeAjuda">
            <USelect v-model="form.validade" :items="(['sempre', '7', '30', '90'] as const).map(v => ({ label: ta.novo.validadeOpcoes[v], value: v }))" class="w-48" />
          </UFormField>
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="novo = false" />
          <UButton :label="ta.novo.enviar" icon="i-lucide-send" :loading="enviando" :disabled="!podeEnviar" @click="enviar" />
        </div>
      </template>
    </USlideover>
  </div>
</template>

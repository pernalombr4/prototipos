<script setup lang="ts">
/**
 * Pedido 3: Integrações › Contas de serviço. Tela nova.
 *
 * Hoje a integração usa o token de uma pessoa: se ela sai, a integração para, e
 * o log mostra a pessoa como autora. Referências: Pipefy (Service Accounts sem
 * licença, OAuth client credentials), Atlassian (Directory › Service accounts) e
 * Figma (criação em 3 blocos, segredo antigo vale 24 h na troca). O que ninguém
 * mostra e entra aqui: a aba "Onde é usada".
 */
import type { Textos } from './textos'
import Cabecalho from './_Cabecalho.vue'
import SegredoUmaVez from './_SegredoUmaVez.vue'
import { DIA, LIMITE_DE_CONTAS, contasDeServico, daqui, nomeDoWorkspace, pessoas, workspaces } from './mocks'
import type { ContaDeServico, PapelNoWorkspace } from './mocks'
import { data, diasAte, numero, relativo } from './apoio'
import { usePoliticaDeTokens } from './estado'

const props = defineProps<{ t: Textos, marcarNovo: boolean }>()
const idioma = useIdioma()
const toast = useToast()
const tc = computed(() => props.t.contas)
const politica = usePoliticaDeTokens()

const contas = useState<ContaDeServico[]>('sa-contas', () => structuredClone(contasDeServico))
const iconeDoUso = { fluxo: 'i-lucide-workflow', webhook: 'i-lucide-webhook', integracao: 'i-lucide-plug' } as const
const papeis = computed(() => (['leitura', 'padrao', 'completo'] as const).map(p => ({ label: props.t.comum.papeis[p], value: p })))

/* ---------- detalhe ---------- */
const aberta = ref<ContaDeServico | null>(null)
const detalhe = computed({ get: () => !!aberta.value, set: (v) => { if (!v) aberta.value = null } })
const abaDetalhe = ref<'usos' | 'acessos' | 'credencial'>('usos')
function abrir(c: ContaDeServico) {
  aberta.value = c
  abaDetalhe.value = 'usos'
}

const segredo = ref(false)
const tituloSegredo = ref('')
const valoresSegredo = ref<{ rotulo: string, valor: string }[]>([])
const confirmarTroca = ref(false)
function trocar() {
  confirmarTroca.value = false
  tituloSegredo.value = tc.value.trocar
  valoresSegredo.value = [{ rotulo: tc.value.segredo, valor: 'cs_sec_8Hq2vLx9TzR4mWp1Ke7Nd3Yb6Ua0Jc5F' }]
  segredo.value = true
  toast.add({ title: tc.value.trocado, icon: 'i-lucide-refresh-cw', color: 'success' })
}
function alternarAtiva(c: ContaDeServico) {
  c.ativa = !c.ativa
  toast.add({ title: c.ativa ? tc.value.reativou(c.nome) : tc.value.desativou(c.nome), icon: c.ativa ? 'i-lucide-play' : 'i-lucide-pause', color: c.ativa ? 'success' : 'neutral' })
}

/* ---------- criar ---------- */
const criando = ref(false)
const novo = reactive({ nome: '', finalidade: '', responsavel: pessoas[3]!.nome, acessos: [{ workspace: workspaces[1]!.reference, papel: 'padrao' as PapelNoWorkspace }], registro: false, validade: 90 })
const validades = computed(() => [30, 60, 90, 180, 365].filter(v => !politica.value.validadeMax || v <= politica.value.validadeMax))
watch(validades, (v) => { if (!v.includes(novo.validade)) novo.validade = v[v.length - 1]! }, { immediate: true })
const limite = computed(() => politica.value.validadeMax ? props.t.tokens.politica.opcoes[politica.value.validadeMax]! : props.t.tokens.politica.opcoes[0]!)
const tentouCriar = ref(false)
const salvando = ref(false)
function abrirCriar() {
  Object.assign(novo, { nome: '', finalidade: '', responsavel: pessoas[3]!.nome, acessos: [{ workspace: workspaces[1]!.reference, papel: 'padrao' }], registro: false })
  tentouCriar.value = false
  criando.value = true
}
function criar() {
  tentouCriar.value = true
  if (!novo.nome.trim()) return
  salvando.value = true
  setTimeout(() => {
    contas.value.unshift({
      id: `cs${Date.now()}`,
      nome: novo.nome.trim(),
      finalidade: novo.finalidade.trim(),
      responsavel: novo.responsavel,
      acessos: novo.acessos.map(a => ({ ...a })),
      criada: new Date(),
      credencialExpira: daqui(novo.validade * DIA),
      ultimoUso: null,
      ativa: true,
      usos: [],
    })
    salvando.value = false
    criando.value = false
    tituloSegredo.value = tc.value.novo.criadaTitulo
    valoresSegredo.value = [
      { rotulo: tc.value.clientId, valor: `cs_${novo.nome.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').slice(0, 18)}_4f9c21` },
      { rotulo: tc.value.segredo, valor: 'cs_sec_Q1w2E3r4T5y6U7i8O9p0AsDfGhJkL' },
    ]
    segredo.value = true
    toast.add({ title: tc.value.novo.criada(novo.nome.trim()), icon: 'i-lucide-check', color: 'success' })
  }, 700)
}
</script>

<template>
  <div>
    <Cabecalho :titulo="tc.titulo" :intro="tc.intro" :novo="marcarNovo" :rotulo-novo="t.casca.novo">
      <template #acoes>
        <span class="text-xs text-muted">{{ tc.contagem(contas.length, LIMITE_DE_CONTAS) }}</span>
        <UButton :label="tc.criar" icon="i-lucide-plus" size="sm" :disabled="contas.length >= LIMITE_DE_CONTAS" @click="abrirCriar" />
      </template>
    </Cabecalho>

    <div class="grid gap-3 p-6 md:grid-cols-2 2xl:grid-cols-3">
      <TransitionGroup enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 -translate-y-2 scale-95">
        <article
          v-for="(c, i) in contas"
          :key="c.id"
          class="group relative animate-[entrada_.3s_ease-out_both] rounded-lg border bg-default p-4 transition hover:-translate-y-0.5 hover:shadow-md"
          :class="[c.ativa ? 'border-default' : 'border-dashed border-accented opacity-70', diasAte(c.credencialExpira) <= 14 && c.ativa ? 'border-warning/50' : '']"
          :style="{ animationDelay: `${i * 60}ms` }"
        >
          <div class="flex items-start gap-3">
            <span class="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <UIcon name="i-lucide-bot-message-square" class="size-5 text-primary" />
            </span>
            <div class="min-w-0 flex-1">
              <h3 class="font-semibold text-highlighted">
                <a href="#" class="after:absolute after:inset-0 focus-visible:outline-none" @click.prevent="abrir(c)">{{ c.nome }}</a>
              </h3>
              <p class="line-clamp-2 text-sm text-muted">{{ c.finalidade }}</p>
            </div>
            <UBadge v-if="!c.ativa" :label="tc.desativada" color="neutral" variant="soft" size="sm" />
          </div>
          <div class="mt-3 flex flex-wrap gap-1">
            <UBadge v-for="a in c.acessos" :key="a.workspace" :label="`${nomeDoWorkspace(a.workspace)} · ${t.comum.papeis[a.papel]}`" color="neutral" variant="outline" size="sm" class="max-w-full truncate" />
            <UBadge v-if="!c.acessos.length" :label="tc.leRegistro" color="info" variant="soft" size="sm" icon="i-lucide-scroll-text" />
          </div>
          <dl class="mt-3 space-y-1 text-xs">
            <div class="flex items-center gap-1.5 text-toned"><UIcon name="i-lucide-user-round" class="size-3.5 text-muted" />{{ tc.responsavel }}: {{ c.responsavel }}</div>
            <div class="flex items-center gap-1.5" :class="diasAte(c.credencialExpira) <= 14 ? 'text-warning' : 'text-toned'"><UIcon name="i-lucide-hourglass" class="size-3.5" />{{ tc.expira(relativo(c.credencialExpira, idioma)) }}</div>
            <div class="flex items-center gap-1.5 text-toned"><UIcon name="i-lucide-activity" class="size-3.5 text-muted" />{{ c.ultimoUso ? tc.ultimoUso(relativo(c.ultimoUso, idioma)) : t.tokens.nuncaUsado }}</div>
          </dl>
          <p class="mt-3 flex items-center justify-between border-t border-default pt-2 text-xs text-muted">
            <span>{{ tc.usos(c.usos.length) }}</span>
            <UIcon name="i-lucide-arrow-right" class="size-4 transition-transform group-hover:translate-x-1" />
          </p>
        </article>
      </TransitionGroup>
    </div>

    <!-- Detalhe -->
    <USlideover v-model:open="detalhe" :title="aberta?.nome" :description="aberta?.finalidade" :ui="{ content: 'max-w-xl' }">
      <template #body>
        <div v-if="aberta" class="space-y-4">
          <UTabs
            v-model="abaDetalhe"
            :items="[{ label: tc.abas.usos, value: 'usos' }, { label: tc.abas.acessos, value: 'acessos' }, { label: tc.abas.credencial, value: 'credencial' }]"
            :content="false"
            size="sm"
          />
          <div v-if="abaDetalhe === 'usos'" class="space-y-2 animate-[entrada_.2s_ease-out]">
            <div v-for="u in aberta.usos" :key="u.nome" class="flex items-center gap-3 rounded-md border border-default p-3">
              <UIcon :name="iconeDoUso[u.tipo]" class="size-5 text-primary" />
              <div class="min-w-0 flex-1">
                <p class="text-sm font-medium text-highlighted">{{ u.nome }}</p>
                <p class="text-xs text-muted">{{ tc.usoTipos[u.tipo] }}<template v-if="u.workspace"> · {{ nomeDoWorkspace(u.workspace) }}</template></p>
              </div>
              <span class="text-xs text-toned">{{ tc.chamadas(numero(u.chamadas30d, idioma)) }}</span>
            </div>
            <UEmpty v-if="!aberta.usos.length" icon="i-lucide-plug" :title="tc.usos(0)" variant="naked" />
          </div>
          <div v-else-if="abaDetalhe === 'acessos'" class="space-y-2 animate-[entrada_.2s_ease-out]">
            <div v-for="a in aberta.acessos" :key="a.workspace" class="flex items-center gap-2 rounded-md border border-default p-3">
              <UIcon name="i-lucide-briefcase" class="size-4 text-muted" />
              <span class="flex-1 text-sm text-highlighted">{{ nomeDoWorkspace(a.workspace) }}</span>
              <USelect v-model="a.papel" :items="papeis" size="xs" class="w-40" />
            </div>
            <UAlert v-if="!aberta.acessos.length" icon="i-lucide-scroll-text" color="info" variant="subtle" :title="tc.leRegistro" :description="tc.novo.registroAjuda" />
          </div>
          <div v-else class="space-y-3 animate-[entrada_.2s_ease-out]">
            <UFormField :label="tc.clientId">
              <UInput :model-value="`cs_${aberta.id}_4f9c21`" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
            </UFormField>
            <UFormField :label="tc.segredo">
              <UInput model-value="••••••••••••••••••••" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
            </UFormField>
            <p class="text-xs" :class="diasAte(aberta.credencialExpira) <= 14 ? 'text-warning' : 'text-muted'">{{ tc.expira(data(aberta.credencialExpira, idioma)) }}</p>
            <UButton :label="tc.trocar" icon="i-lucide-refresh-cw" color="neutral" variant="outline" size="sm" @click="confirmarTroca = true" />
          </div>
        </div>
      </template>
      <template #footer>
        <div v-if="aberta" class="flex w-full gap-2">
          <UButton :label="t.comum.verRegistro" icon="i-lucide-scroll-text" color="neutral" variant="ghost" size="sm" />
          <UButton :label="aberta.ativa ? tc.desativar : tc.reativar" :icon="aberta.ativa ? 'i-lucide-pause' : 'i-lucide-play'" :color="aberta.ativa ? 'error' : 'primary'" variant="outline" size="sm" class="ml-auto" @click="alternarAtiva(aberta)" />
        </div>
      </template>
    </USlideover>

    <UModal v-model:open="confirmarTroca" :title="tc.trocarTitulo" :description="tc.trocarTexto">
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="confirmarTroca = false" />
          <UButton :label="tc.trocar" @click="trocar" />
        </div>
      </template>
    </UModal>

    <!-- Criar -->
    <USlideover v-model:open="criando" :title="tc.novo.titulo" :ui="{ content: 'max-w-xl' }">
      <template #body>
        <div class="space-y-6">
          <section class="space-y-3">
            <h4 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><span class="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">1</span>{{ tc.novo.bloco1 }}</h4>
            <UFormField :label="tc.novo.nome" required :error="tentouCriar && !novo.nome.trim() ? t.comum.obrigatorio : undefined">
              <UInput v-model="novo.nome" :placeholder="tc.novo.nomePh" class="w-full" autofocus />
            </UFormField>
            <UFormField :label="tc.novo.finalidade">
              <UTextarea v-model="novo.finalidade" :placeholder="tc.novo.finalidadePh" :rows="2" class="w-full" />
            </UFormField>
            <UFormField :label="tc.novo.responsavel" :help="tc.novo.responsavelAjuda">
              <USelect v-model="novo.responsavel" :items="pessoas.slice(0, 11).map(p => p.nome)" class="w-full" />
            </UFormField>
          </section>
          <section class="space-y-3">
            <h4 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><span class="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">2</span>{{ tc.novo.bloco2 }}</h4>
            <TransitionGroup tag="div" class="space-y-2" enter-active-class="transition duration-200" enter-from-class="opacity-0 -translate-y-1">
              <div v-for="(a, i) in novo.acessos" :key="i" class="flex items-center gap-2">
                <USelect v-model="a.workspace" :items="workspaces.map(w => ({ label: w.name, value: w.reference }))" size="sm" class="min-w-0 flex-1" :aria-label="tc.novo.acessoWs" />
                <USelect v-model="a.papel" :items="papeis" size="sm" class="w-40" :aria-label="tc.novo.acessoPapel" />
                <UButton icon="i-lucide-x" size="sm" color="neutral" variant="ghost" :aria-label="t.comum.excluir" @click="novo.acessos.splice(i, 1)" />
              </div>
            </TransitionGroup>
            <UButton :label="tc.novo.addAcesso" icon="i-lucide-plus" size="xs" color="neutral" variant="outline" @click="novo.acessos.push({ workspace: workspaces[0]!.reference, papel: 'leitura' })" />
            <UCheckbox v-model="novo.registro" :label="tc.novo.registro" :description="tc.novo.registroAjuda" />
          </section>
          <section class="space-y-3">
            <h4 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><span class="flex size-5 items-center justify-center rounded-full bg-primary/10 text-xs text-primary">3</span>{{ tc.novo.bloco3 }}</h4>
            <UFormField :label="tc.novo.validade" :help="tc.novo.validadeAjuda(limite)">
              <USelect v-model="novo.validade" :items="validades.map(v => ({ label: t.tokens.politica.opcoes[v], value: v }))" class="w-48" />
            </UFormField>
          </section>
        </div>
      </template>
      <template #footer>
        <div class="ml-auto flex gap-2">
          <UButton :label="t.comum.cancelar" color="neutral" variant="ghost" @click="criando = false" />
          <UButton :label="tc.novo.criar" :loading="salvando" @click="criar" />
        </div>
      </template>
    </USlideover>

    <SegredoUmaVez v-model:open="segredo" :t="t" :titulo="tituloSegredo" :valores="valoresSegredo" />
  </div>
</template>

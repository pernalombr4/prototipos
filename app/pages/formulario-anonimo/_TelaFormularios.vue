<script setup lang="ts">
/**
 * Configurações › Estrutura › Categorias › Denúncias. Cópia do develop: o painel
 * da categoria com os 12 cartões (ev-01), a lista de Formulários (ev-02, ev-03) e
 * o painel de edição com Definição, Visual e Avançado (ev-04 a ev-06).
 *
 * PROPOSTA (contorno do andaime):
 *  - Visibilidade ganha a 3ª opção, "Anônimo", ao lado de Privado e Público;
 *  - com Anônimo, o painel ganha a aba "Anonimato": criador anonymous, link fixo
 *    e QR code, proteção contra robô, retorno ao denunciante e o que o item
 *    nunca guarda;
 *  - em Avançado, Rascunhos fica desligado no formulário anônimo.
 * Público continua como é hoje (Acesso Externo com e-mail e código).
 */
import type { DropdownMenuItem, TabsItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { ANONYMOUS, type Formulario, LINK_DE_ACOMPANHAMENTO, categoria, linkDoFormulario, volume24h } from './mocks'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const { formularios, vistaDaCategoria, formularioAberto, abaDoFormulario, ir } = useFormularioAnonimo()
const marca = useMarcaDeProposta()
const toast = useToast()
const idioma = useIdioma()

const cartoes = [
  { chave: 'campos', icone: 'i-lucide-text-cursor-input' },
  { chave: 'formularios', icone: 'i-lucide-file-spreadsheet' },
  { chave: 'fluxos', icone: 'i-lucide-share-2' },
  { chave: 'pastas', icone: 'i-lucide-folder' },
  { chave: 'relatorios', icone: 'i-lucide-chart-line' },
  { chave: 'condicionais', icone: 'i-lucide-list-filter' },
  { chave: 'templates', icone: 'i-lucide-file-type' },
  { chave: 'notificacoes', icone: 'i-lucide-bell' },
  { chave: 'responsabilidade', icone: 'i-lucide-shield' },
  { chave: 'execucoes', icone: 'i-lucide-calendar-clock' },
  { chave: 'status', icone: 'i-lucide-tag' },
  { chave: 'correcao', icone: 'i-lucide-circle-dollar-sign' },
]

function abrirCartao(chave: string) {
  if (chave === 'formularios') vistaDaCategoria.value = 'formularios'
  else if (chave === 'fluxos') ir('spaceflow')
  else toast.add({ title: props.t.categoria.acaoForaDoPrototipo, icon: 'i-lucide-info', color: 'neutral' })
}

/* ---------- lista de formulários ---------- */

const formatoDia = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const corDaVisibilidade = { privado: 'success', publico: 'warning', anonimo: 'info' } as const

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'criadoEm', label: props.t.categoria.criadoEm },
  { key: 'nome', label: props.t.categoria.nome },
  { key: 'icone', label: props.t.categoria.icone },
  { key: 'visibilidade', label: props.t.categoria.visibilidade },
])

interface Linha extends Record<string, unknown> { id: number, criadoEm: string, nome: string, icone: string, visibilidade: Formulario['visibilidade'] }
const linhas = computed<Linha[]>(() => formularios.value.map(f => ({ id: f.id, criadoEm: formatoDia.value.format(f.criadoEm), nome: f.nome, icone: f.icone, visibilidade: f.visibilidade })))

async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto)
  }
  catch { /* sem permissão de área de transferência: o aviso sai igual */ }
  toast.add({ title: props.t.categoria.linkCopiado, icon: 'i-lucide-circle-check', color: 'success' })
}

function menuDaLinha(id: number): DropdownMenuItem[][] {
  const f = formularios.value.find(x => x.id === id)!
  const fora = () => toast.add({ title: props.t.categoria.acaoForaDoPrototipo, icon: 'i-lucide-info', color: 'neutral' })
  return [[
    { label: props.t.categoria.menu.editar, icon: 'i-lucide-pencil', onSelect: () => abrir(id, 'definicao') },
    { label: props.t.categoria.menu.deletar, icon: 'i-lucide-trash-2', onSelect: fora },
    { label: props.t.categoria.menu.duplicar, icon: 'i-lucide-copy', onSelect: fora },
    { label: props.t.categoria.menu.exportar, icon: 'i-lucide-download', onSelect: fora },
    ...(f.visibilidade !== 'privado' ? [{ label: props.t.categoria.menu.copiar, icon: 'i-lucide-link', onSelect: () => copiar(linkDoFormulario(f)) }] : []),
    { label: props.t.categoria.menu.acessar, icon: 'i-lucide-arrow-right', onSelect: fora },
  ]]
}

/* ---------- painel de edição ---------- */

const rascunho = ref<Formulario | null>(null)
watch(formularioAberto, (id) => {
  const f = formularios.value.find(x => x.id === id)
  rascunho.value = f ? structuredClone(toRaw(f)) : null
}, { immediate: true })

function abrir(id: number, aba = 'definicao') {
  abaDoFormulario.value = aba
  formularioAberto.value = id
}

const aberto = computed({
  get: () => formularioAberto.value !== null,
  set: (v) => { if (!v) formularioAberto.value = null },
})

const anonimo = computed(() => rascunho.value?.visibilidade === 'anonimo')

const abas = computed<TabsItem[]>(() => [
  { label: props.t.formulario.abas.definicao, value: 'definicao', slot: 'definicao' as const },
  { label: props.t.formulario.abas.visual, value: 'visual', slot: 'visual' as const },
  { label: props.t.formulario.abas.avancado, value: 'avancado', slot: 'avancado' as const },
  ...(anonimo.value ? [{ label: props.t.formulario.abas.anonimato, value: 'anonimato', icon: 'i-lucide-venetian-mask', slot: 'anonimato' as const, class: marca.value }] : []),
])

watch(anonimo, (a) => {
  if (!a && abaDoFormulario.value === 'anonimato') abaDoFormulario.value = 'definicao'
  if (a && rascunho.value) rascunho.value.rascunhos = false
})

const tipos = computed(() => (['criacao', 'edicao', 'visualizacao'] as const).map(v => ({ value: v, label: props.t.formulario.tipos[v] })))
const visibilidades = computed(() => (['privado', 'publico', 'anonimo'] as const).map(v => ({
  value: v,
  label: props.t.categoria.visibilidades[v],
  disabled: v === 'anonimo' && rascunho.value?.tipo !== 'criacao',
})))

const verificacoes = computed(() => [
  { value: 'enspace', label: props.t.formulario.anonimato.verificacaoEnspace[0], description: props.t.formulario.anonimato.verificacaoEnspace[1] },
  { value: 'turnstile', label: props.t.formulario.anonimato.verificacaoTurnstile[0], description: props.t.formulario.anonimato.verificacaoTurnstile[1] },
])
const prazos = computed(() => ([30, 60, 90] as const).map(v => ({ value: v, label: props.t.formulario.anonimato.dias(v) })))
const apagarOpcoes = computed(() => (['ao_concluir', 'trinta_dias'] as const).map(v => ({ value: v, label: props.t.formulario.anonimato.apagar[v] })))

const salvando = ref(false)
async function salvar() {
  if (!rascunho.value) return
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  formularios.value = formularios.value.map(f => f.id === rascunho.value!.id ? structuredClone(toRaw(rascunho.value!)) : f)
  salvando.value = false
  toast.add({ title: props.t.formulario.salvo, icon: 'i-lucide-circle-check', color: 'success' })
}

/* ---------- volume das últimas 24 h ---------- */

const totalAceitos = volume24h.reduce((s, h) => s + h.aceitos, 0)
const totalBarrados = volume24h.reduce((s, h) => s + h.barrados, 0)
const maiorBarrado = Math.max(...volume24h.map(h => h.barrados))
/** Escala logarítmica: o pico de robô não pode apagar as horas normais. */
function intensidade(n: number) {
  return n === 0 ? 0 : Math.max(0.12, Math.log10(n + 1) / Math.log10(maiorBarrado + 1))
}

/* ---------- QR code (maquete: desenho fixo, não é um QR legível) ---------- */

const qr = computed(() => {
  const semente = (rascunho.value?.identification ?? 'x').split('').reduce((s, c) => (s * 31 + c.charCodeAt(0)) % 2147483647, 7)
  let s = semente
  const n = 25
  const celulas: boolean[] = []
  for (let i = 0; i < n * n; i++) {
    s = (s * 16807) % 2147483647
    celulas.push(s % 3 === 0)
  }
  const olho = (x: number, y: number) => {
    for (const [ox, oy] of [[0, 0], [n - 7, 0], [0, n - 7]] as const) {
      const dx = x - ox
      const dy = y - oy
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) return dx === 0 || dx === 6 || dy === 0 || dy === 6 || (dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4) ? 1 : 0
    }
    return -1
  }
  const pretos: [number, number][] = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const o = olho(x, y)
      if (o === 1 || (o === -1 && celulas[y * n + x])) pretos.push([x, y])
    }
  }
  return { n, pretos }
})

function baixarQr() {
  const { n, pretos } = qr.value
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 ${n + 4} ${n + 4}" width="400" height="400"><rect x="-2" y="-2" width="${n + 4}" height="${n + 4}" fill="#fff"/>${pretos.map(([x, y]) => `<rect x="${x}" y="${y}" width="1" height="1"/>`).join('')}</svg>`
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }))
  a.download = 'canal-de-denuncia-qr.svg'
  a.click()
  URL.revokeObjectURL(a.href)
}
</script>

<template>
  <div class="px-4 py-3">
    <!-- Painel da categoria: os 12 cartões de hoje -->
    <template v-if="vistaDaCategoria === 'painel'">
      <div class="mb-4 flex items-center gap-3">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.casca.voltar" />
        <h1 class="text-xl font-bold text-highlighted">{{ categoria.name }}</h1>
      </div>
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <button
          v-for="(c, i) in cartoes"
          :key="c.chave"
          type="button"
          class="group flex flex-col rounded-lg border border-default bg-default text-left transition duration-200 hover:-translate-y-0.5 hover:border-accented hover:shadow-sm animate-[entrada_.3s_ease-out_both]"
          :style="{ animationDelay: `${i * 25}ms` }"
          @click="abrirCartao(c.chave)"
        >
          <span class="flex items-center gap-3 border-b border-default px-4 py-3">
            <span class="flex size-8 items-center justify-center rounded-full bg-elevated"><UIcon :name="c.icone" class="size-4 text-toned" /></span>
            <span class="text-sm font-semibold text-highlighted">{{ t.categoria.cartoes[c.chave]![0] }}</span>
          </span>
          <span class="min-h-16 px-4 py-3 text-xs text-toned">{{ t.categoria.cartoes[c.chave]![1] }}</span>
          <span class="border-t border-default px-4 py-2.5">
            <span class="inline-flex rounded-md bg-elevated px-2.5 py-1 transition-colors group-hover:bg-accented"><UIcon name="i-lucide-arrow-right" class="size-3.5 text-toned" /></span>
          </span>
        </button>
      </div>
    </template>

    <!-- Lista de formulários -->
    <template v-else>
      <div class="mb-3 flex items-center gap-3">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="sm" :aria-label="t.casca.voltar" @click="vistaDaCategoria = 'painel'" />
        <h1 class="text-xl font-bold text-highlighted">{{ categoria.name }}</h1>
      </div>

      <div class="mb-3 rounded-lg border border-default bg-default">
        <div class="flex items-center gap-2 border-b border-default px-3 py-2.5">
          <span class="flex size-7 items-center justify-center rounded-md bg-primary/15"><UIcon name="i-lucide-file-spreadsheet" class="size-4 text-primary" /></span>
          <span class="text-sm font-medium text-highlighted">{{ t.categoria.formulario }}</span>
          <UBadge :label="t.categoria.criar" color="success" variant="soft" size="sm" />
          <UIcon name="i-lucide-settings" class="ml-auto size-4 text-muted" />
        </div>
        <div class="flex items-center gap-2 px-3 py-2">
          <UButton icon="i-lucide-search" color="neutral" variant="soft" size="sm" :aria-label="t.itens.pesquisar" />
          <UButton icon="i-lucide-filter" color="neutral" variant="soft" size="sm" :aria-label="t.itens.filtros" />
          <UButton icon="i-lucide-refresh-cw" color="neutral" variant="soft" size="sm" class="ml-auto" :aria-label="t.casca.recarregar" />
          <UButton :label="t.categoria.nome" trailing-icon="i-lucide-arrow-down" color="neutral" variant="soft" size="sm" />
        </div>
      </div>

      <div class="animate-[entrada_.25s_ease-out]">
        <EnTable
          :columns="colunas"
          :rows="linhas"
          :locale="idioma"
          @row-click="(r) => abrir((r as Linha).id)"
        >
          <template #actions="{ row }">
            <UDropdownMenu :items="menuDaLinha((row as Linha).id)" :content="{ align: 'start' }" :ui="{ content: 'w-60' }">
              <UButton icon="i-lucide-chevron-down" color="neutral" variant="soft" size="xs" :aria-label="t.categoria.acoes" @click.stop />
            </UDropdownMenu>
          </template>
          <template #cell-icone="{ row }">
            <UIcon :name="(row as Linha).icone" class="size-4 text-toned" />
          </template>
          <template #cell-visibilidade="{ row }">
            <UBadge
              :label="t.categoria.visibilidades[(row as Linha).visibilidade]"
              :color="corDaVisibilidade[(row as Linha).visibilidade]"
              :icon="(row as Linha).visibilidade === 'anonimo' ? 'i-lucide-venetian-mask' : undefined"
              variant="subtle"
              size="sm"
              :class="(row as Linha).visibilidade === 'anonimo' ? marca : ''"
            />
          </template>
        </EnTable>
        <p class="mt-3 text-center text-xs text-muted">{{ t.categoria.mostrando(linhas.length) }}</p>
      </div>
    </template>

    <!-- Painel de edição do formulário (cópia do develop + aba Anonimato) -->
    <USlideover
      v-model:open="aberto"
      :title="rascunho ? t.formulario.titulo(rascunho.nome) : ''"
      side="right"
      :ui="{ content: 'max-w-2xl', body: 'p-0 sm:p-0' }"
    >
      <template #body>
        <div v-if="rascunho" class="flex h-full flex-col">
          <UTabs
            v-model="abaDoFormulario"
            :items="abas"
            variant="link"
            :ui="{ list: 'px-4 border-b border-default', trigger: 'text-sm', content: 'px-4 pb-6 pt-4' }"
          >
            <!-- Definição -->
            <template #definicao>
              <div class="flex flex-col gap-4">
                <UFormField :label="t.formulario.nome">
                  <UInput v-model="rascunho.nome" class="w-full" />
                </UFormField>
                <UFormField :label="t.formulario.descricao">
                  <UInput v-model="rascunho.descricao" :placeholder="t.formulario.porFavorDigite" :maxlength="300" class="w-full">
                    <template #trailing><span class="text-xs text-dimmed">{{ rascunho.descricao.length }} / 300</span></template>
                  </UInput>
                </UFormField>
                <UFormField :label="t.formulario.tipo">
                  <USelect v-model="rascunho.tipo" :items="tipos" class="w-full" />
                </UFormField>
                <UFormField :label="t.formulario.visibilidade" :help="t.formulario.ajudaVisibilidade[rascunho.visibilidade]" :class="marca">
                  <USelect v-model="rascunho.visibilidade" :items="visibilidades" class="w-full">
                    <template #leading>
                      <UIcon v-if="rascunho.visibilidade === 'anonimo'" name="i-lucide-venetian-mask" class="size-4 text-info" />
                    </template>
                  </USelect>
                </UFormField>
                <p v-if="rascunho.tipo !== 'criacao'" class="-mt-2 flex items-center gap-1.5 text-xs text-muted">
                  <UIcon name="i-lucide-info" class="size-3.5" />{{ t.formulario.soCriacao }}
                </p>
                <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
              </div>
            </template>

            <!-- Visual -->
            <template #visual>
              <div class="flex flex-col gap-4">
                <UFormField :label="t.formulario.icone">
                  <UInput :model-value="rascunho.icone" readonly class="w-full" />
                </UFormField>
                <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
              </div>
            </template>

            <!-- Avançado -->
            <template #avancado>
              <div class="flex flex-col gap-5">
                <UFormField :label="t.formulario.avancado.triagem" :hint="t.formulario.avancado.triagemAjuda">
                  <USwitch v-model="rascunho.triagem" />
                </UFormField>
                <UFormField :label="t.formulario.avancado.listaTriagem">
                  <USwitch v-model="rascunho.listaTriagem" />
                </UFormField>
                <UFormField :label="t.formulario.avancado.documentosModelo">
                  <USwitch v-model="rascunho.documentosModelo" />
                </UFormField>
                <UFormField
                  :label="t.formulario.avancado.rascunhos"
                  :help="anonimo ? t.formulario.avancado.rascunhoAnonimo : t.formulario.avancado.rascunhosAjuda"
                  :class="anonimo ? marca : ''"
                >
                  <USwitch v-model="rascunho.rascunhos" :disabled="anonimo" />
                </UFormField>
                <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
              </div>
            </template>

            <!-- Anonimato (PROPOSTA) -->
            <template #anonimato>
              <div class="flex flex-col gap-6" :class="marca">
                <!-- Criador -->
                <section class="flex gap-3 rounded-lg border border-info/30 bg-info/5 p-3">
                  <UAvatar icon="i-lucide-venetian-mask" size="md" :ui="{ root: 'bg-info/15', icon: 'text-info' }" />
                  <div class="min-w-0">
                    <p class="text-sm font-semibold text-highlighted">{{ t.formulario.anonimato.criadorTitulo }}: <span class="font-mono">{{ ANONYMOUS.nome }}</span></p>
                    <p class="mt-1 text-xs text-toned">{{ t.formulario.anonimato.criadorTexto }}</p>
                  </div>
                </section>

                <!-- Link -->
                <section class="flex flex-col gap-3">
                  <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-link" class="size-4 text-muted" />{{ t.formulario.anonimato.linkTitulo }}</h3>
                  <div class="flex gap-4">
                    <div class="flex min-w-0 flex-1 flex-col gap-2">
                      <UInput :model-value="linkDoFormulario(rascunho)" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
                      <p class="text-xs text-muted">{{ t.formulario.anonimato.linkAjuda }}</p>
                      <div class="flex flex-wrap gap-2">
                        <UButton icon="i-lucide-copy" :label="t.formulario.anonimato.copiarLink" color="neutral" variant="outline" size="sm" @click="copiar(linkDoFormulario(rascunho))" />
                        <UButton icon="i-lucide-external-link" :label="t.formulario.anonimato.abrirPagina" color="neutral" variant="outline" size="sm" @click="ir('publico')" />
                      </div>
                      <UFormField :label="t.formulario.anonimato.acompanhamento" :help="t.formulario.anonimato.acompanhamentoAjuda" class="mt-2">
                        <UInput :model-value="LINK_DE_ACOMPANHAMENTO" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
                      </UFormField>
                    </div>
                    <div class="flex w-36 shrink-0 flex-col items-center gap-2">
                      <svg :viewBox="`-2 -2 ${qr.n + 4} ${qr.n + 4}`" class="size-32 rounded-md border border-default bg-white p-1" role="img" :aria-label="t.formulario.anonimato.qrCode">
                        <rect v-for="([x, y], i) in qr.pretos" :key="i" :x="x" :y="y" width="1" height="1" fill="black" />
                      </svg>
                      <p class="text-center text-[11px] text-muted">{{ t.formulario.anonimato.qrAjuda }}</p>
                      <UButton icon="i-lucide-download" :label="t.formulario.anonimato.baixarQr" color="neutral" variant="outline" size="xs" @click="baixarQr" />
                    </div>
                  </div>
                </section>

                <USeparator />

                <!-- Proteção -->
                <section class="flex flex-col gap-4">
                  <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-shield-check" class="size-4 text-muted" />{{ t.formulario.anonimato.protecaoTitulo }}</h3>
                  <UFormField :label="t.formulario.anonimato.verificacao">
                    <URadioGroup v-model="rascunho.verificacao" :items="verificacoes" variant="card" :ui="{ description: 'text-toned' }" />
                  </UFormField>
                  <div class="grid grid-cols-2 gap-3">
                    <UFormField :label="t.formulario.anonimato.limitePorHora">
                      <UInputNumber v-model="rascunho.limitePorHora" :min="1" :max="1000" class="w-full" />
                    </UFormField>
                    <UFormField :label="t.formulario.anonimato.limitePorDia">
                      <UInputNumber v-model="rascunho.limitePorDia" :min="1" :max="10000" class="w-full" />
                    </UFormField>
                  </div>
                  <p class="-mt-2 text-xs text-muted">{{ t.formulario.anonimato.limiteAjuda }}</p>
                  <UFormField :label="t.formulario.anonimato.pausarNoPico" :help="t.formulario.anonimato.pausarAjuda">
                    <USwitch v-model="rascunho.pausarNoPico" />
                  </UFormField>

                  <!-- Volume -->
                  <div class="rounded-lg border border-default p-3">
                    <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                      <span class="text-xs font-medium text-toned">{{ t.formulario.anonimato.ultimas24h }}</span>
                      <span class="flex gap-3 text-xs">
                        <span class="flex items-center gap-1.5 text-toned"><span class="size-2 rounded-full bg-success" />{{ t.formulario.anonimato.aceitos(totalAceitos) }}</span>
                        <span class="flex items-center gap-1.5 text-toned"><span class="size-2 rounded-full bg-error" />{{ t.formulario.anonimato.barrados(totalBarrados) }}</span>
                      </span>
                    </div>
                    <div class="flex h-10 items-end gap-0.5" role="img" :aria-label="`${t.formulario.anonimato.aceitos(totalAceitos)}, ${t.formulario.anonimato.barrados(totalBarrados)}`">
                      <UTooltip v-for="h in volume24h" :key="h.hora" :text="`${h.hora}h · ${t.formulario.anonimato.legendaAceitos} ${h.aceitos} · ${t.formulario.anonimato.legendaBarrados} ${h.barrados}`">
                        <span class="flex h-full flex-1 flex-col justify-end gap-px">
                          <span class="w-full rounded-t-sm bg-error transition-all" :style="{ height: `${intensidade(h.barrados) * 70}%` }" />
                          <span class="w-full rounded-sm bg-success" :style="{ height: h.aceitos ? `${10 + h.aceitos * 8}%` : '2px', opacity: h.aceitos ? 1 : 0.25 }" />
                        </span>
                      </UTooltip>
                    </div>
                    <div class="mt-1 flex justify-between text-[10px] text-muted"><span>0h</span><span>12h</span><span>23h</span></div>
                    <p class="mt-2 flex items-center gap-1.5 text-xs text-toned"><UIcon name="i-lucide-octagon-pause" class="size-3.5 text-warning" />{{ t.formulario.anonimato.picoAs(3) }}</p>
                  </div>
                </section>

                <USeparator />

                <!-- Retorno -->
                <section class="flex flex-col gap-4">
                  <h3 class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-message-square-reply" class="size-4 text-muted" />{{ t.formulario.anonimato.retornoTitulo }}</h3>
                  <UFormField :label="t.formulario.anonimato.mensagemConfirmacao" :help="t.formulario.anonimato.mensagemAjuda">
                    <UTextarea v-model="rascunho.mensagemDeConfirmacao" :rows="3" autoresize class="w-full" />
                  </UFormField>
                  <UFormField :label="t.formulario.anonimato.prazoDeRetorno" :help="t.formulario.anonimato.prazoAjuda">
                    <USelect v-model="rascunho.prazoDeRetornoDias" :items="prazos" class="w-48" />
                  </UFormField>
                  <UFormField :label="t.formulario.anonimato.avisoPorEmail" :help="t.formulario.anonimato.avisoAjuda">
                    <USwitch v-model="rascunho.oferecerAvisoPorEmail" />
                  </UFormField>
                  <UFormField v-if="rascunho.oferecerAvisoPorEmail" :label="t.formulario.anonimato.apagarEmail">
                    <USelect v-model="rascunho.apagarEmail" :items="apagarOpcoes" class="w-72" />
                  </UFormField>
                </section>

                <USeparator />

                <!-- O que nunca é guardado -->
                <section class="rounded-lg bg-elevated/60 p-3">
                  <h3 class="mb-2 text-sm font-semibold text-highlighted">{{ t.formulario.anonimato.nuncaTitulo }}</h3>
                  <ul class="flex flex-col gap-1.5">
                    <li v-for="n in t.formulario.anonimato.nunca" :key="n" class="flex items-start gap-2 text-xs text-toned">
                      <UIcon name="i-lucide-circle-slash" class="mt-0.5 size-3.5 shrink-0 text-muted" />{{ n }}
                    </li>
                  </ul>
                </section>

                <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
              </div>
            </template>
          </UTabs>
        </div>
      </template>
    </USlideover>
  </div>
</template>

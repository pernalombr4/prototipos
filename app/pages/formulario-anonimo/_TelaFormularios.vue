<script setup lang="ts">
/**
 * Configurações › Estrutura › Categorias › Ouvidoria. Cópia do develop: o painel
 * da categoria com os 12 cartões (ev-01), a lista de Formulários (ev-02, ev-03) e
 * o painel de edição com Definição, Visual e Avançado (ev-04 a ev-06).
 *
 * PROPOSTA (contorno do andaime): 3 configurações independentes, cada uma no
 * lugar dela. Tipo e Visibilidade continuam como hoje.
 *  - Definição › "Acesso pelo link": Com login (hoje) ou Sem login. Só aparece
 *    com Visibilidade Público, logo abaixo dela, com o link e o QR code;
 *  - Avançado › "Respostas anônimas": vale para formulário Privado ou Público.
 *    Dentro dela, opcional, o acompanhamento por protocolo e senha com o retorno
 *    a quem respondeu (automático ou pelo Spaceflow, nunca os 2);
 *  - Avançado › "Proteção do link sem login": só existe com acesso sem login.
 */
import type { DropdownMenuItem, TabsItem } from '@nuxt/ui'
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import type { Textos } from './textos'
import { ANONYMOUS, type Formulario, ID_DO_CANAL, TIPOS_DE_FORMULARIO, categoria, formularioEmBranco, linkDoFormulario, volume24h } from './mocks'
import QrCode from './_QrCode.vue'
import { useFormularioAnonimo, useMarcaDeProposta } from './estado'

const props = defineProps<{ t: Textos }>()

const {
  formularios, vistaDaCategoria, formularioAberto, abaDoFormulario, canalCriado, emCriacao, passoPublico, inicioDoCanal,
  criarFormulario, concluirCriacao, abrirConferencia, ir,
} = useFormularioAnonimo()
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

function fora() {
  toast.add({ title: props.t.categoria.acaoForaDoPrototipo, icon: 'i-lucide-info', color: 'neutral' })
}

function abrirCartao(chave: string) {
  if (chave === 'formularios') vistaDaCategoria.value = 'formularios'
  else if (chave === 'fluxos') ir('spaceflow')
  else fora()
}

/* ---------- lista de formulários ---------- */

const formatoDia = computed(() => new Intl.DateTimeFormat(idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' }))
const corDaVisibilidade = { privado: 'success', publico: 'warning' } as const

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'criadoEm', label: props.t.categoria.criadoEm },
  { key: 'nome', label: props.t.categoria.nome },
  { key: 'icone', label: props.t.categoria.icone },
  { key: 'visibilidade', label: props.t.categoria.visibilidade },
])

interface Linha extends Record<string, unknown> {
  id: number
  criadoEm: string
  nome: string
  icone: string
  visibilidade: Formulario['visibilidade']
  semLogin: boolean
  anonimas: boolean
}
const visiveis = computed(() => formularios.value.filter(f => f.id !== ID_DO_CANAL || canalCriado.value))
const linhas = computed<Linha[]>(() => visiveis.value.map(f => ({
  id: f.id,
  criadoEm: formatoDia.value.format(f.criadoEm),
  nome: f.nome,
  icone: f.icone,
  visibilidade: f.visibilidade,
  semLogin: f.visibilidade === 'publico' && f.semLogin,
  anonimas: f.respostasAnonimas,
})))

async function copiar(texto: string) {
  try {
    await navigator.clipboard.writeText(texto)
  }
  catch { /* sem permissão de área de transferência: o aviso sai igual */ }
  toast.add({ title: props.t.categoria.linkCopiado, icon: 'i-lucide-circle-check', color: 'success' })
}

function menuDaLinha(id: number): DropdownMenuItem[][] {
  const f = formularios.value.find(x => x.id === id)!
  return [[
    { label: props.t.categoria.menu.editar, icon: 'i-lucide-pencil', onSelect: () => abrir(id, 'definicao') },
    { label: props.t.categoria.menu.deletar, icon: 'i-lucide-trash-2', onSelect: fora },
    { label: props.t.categoria.menu.duplicar, icon: 'i-lucide-copy', onSelect: fora },
    { label: props.t.categoria.menu.exportar, icon: 'i-lucide-download', onSelect: fora },
    ...(f.visibilidade === 'publico' ? [{ label: props.t.categoria.menu.copiar, icon: 'i-lucide-link', onSelect: () => copiar(linkDoFormulario(f)) }] : []),
    { label: props.t.categoria.menu.acessar, icon: 'i-lucide-arrow-right', onSelect: () => (id === ID_DO_CANAL ? ir('construtor') : fora()) },
  ]]
}

/* ---------- painel de edição ---------- */

const rascunho = ref<Formulario | null>(null)
watch([formularioAberto, emCriacao], ([id, criando]) => {
  if (criando) {
    rascunho.value = formularioEmBranco()
    return
  }
  const f = formularios.value.find(x => x.id === id)
  rascunho.value = f ? structuredClone(toRaw(f)) : null
}, { immediate: true })

function abrir(id: number, aba = 'definicao') {
  emCriacao.value = false
  abaDoFormulario.value = aba
  formularioAberto.value = id
}

const aberto = computed({
  get: () => formularioAberto.value !== null,
  set: (v) => {
    if (!v) {
      formularioAberto.value = null
      emCriacao.value = false
    }
  },
})

const publico = computed(() => rascunho.value?.visibilidade === 'publico')
const semLogin = computed(() => publico.value && !!rascunho.value?.semLogin)
const anonimas = computed(() => !!rascunho.value?.respostasAnonimas)

/* As 3 configurações não se misturam; só 2 regras ligam uma à outra. */
watch(() => rascunho.value?.visibilidade, (v) => {
  // Sem login só existe em formulário Público.
  if (v === 'privado' && rascunho.value) rascunho.value.semLogin = false
})
watch(anonimas, (a, antes) => {
  if (!rascunho.value || antes === undefined) return
  // Rascunho exigiria guardar quem está escrevendo.
  if (a) rascunho.value.rascunhos = false
  else Object.assign(rascunho.value, { anonimatoAtivo: false, acompanhamento: false })
})

const abas = computed<TabsItem[]>(() => [
  { label: props.t.formulario.abas.definicao, value: 'definicao', slot: 'definicao' as const },
  { label: props.t.formulario.abas.visual, value: 'visual', slot: 'visual' as const },
  { label: props.t.formulario.abas.avancado, value: 'avancado', slot: 'avancado' as const },
])

const tipos = computed(() => TIPOS_DE_FORMULARIO.map(v => ({ value: v, label: props.t.formulario.tipos[v] })))
const visibilidades = computed(() => (['privado', 'publico'] as const).map(v => ({ value: v, label: props.t.categoria.visibilidades[v] })))

/** O URadioGroup trabalha com texto: "com" e "sem" login. */
const acesso = computed({
  get: () => (rascunho.value?.semLogin ? 'sem' : 'com'),
  set: (v: string) => { if (rascunho.value) rascunho.value.semLogin = v === 'sem' },
})
const acessos = computed(() => [
  { value: 'com', label: props.t.formulario.acesso.comLogin[0], description: props.t.formulario.acesso.comLogin[1] },
  { value: 'sem', label: props.t.formulario.acesso.semLogin[0], description: props.t.formulario.acesso.semLogin[1] },
])

const verificacoes = computed(() => [
  { value: 'enspace', label: props.t.formulario.protecao.verificacaoEnspace[0], description: props.t.formulario.protecao.verificacaoEnspace[1] },
  { value: 'turnstile', label: props.t.formulario.protecao.verificacaoTurnstile[0], description: props.t.formulario.protecao.verificacaoTurnstile[1] },
])
const modosDeRetorno = computed(() => [
  { value: 'automatico', label: props.t.formulario.anonimas.retornoAutomatico[0], description: props.t.formulario.anonimas.retornoAutomatico[1] },
  { value: 'spaceflow', label: props.t.formulario.anonimas.retornoSpaceflow[0], description: props.t.formulario.anonimas.retornoSpaceflow[1] },
])
const prazos = computed(() => ([30, 60, 90] as const).map(v => ({ value: v, label: props.t.formulario.anonimas.dias(v) })))
const apagarOpcoes = computed(() => (['ao_concluir', 'trinta_dias'] as const).map(v => ({ value: v, label: props.t.formulario.anonimas.apagar[v] })))

const erroNome = ref(false)
watch(() => rascunho.value?.nome, () => (erroNome.value = false))

/** Grava o rascunho. No formulário novo, o primeiro Salvar cria e o painel continua aberto. */
function gravar() {
  if (!rascunho.value) return false
  if (!rascunho.value.nome.trim()) {
    erroNome.value = true
    abaDoFormulario.value = 'definicao'
    return false
  }
  const copia = structuredClone(toRaw(rascunho.value))
  if (emCriacao.value) concluirCriacao(copia)
  else formularios.value = formularios.value.map(f => f.id === copia.id ? copia : f)
  return true
}

const salvando = ref(false)
async function salvar() {
  if (!rascunho.value?.nome.trim()) {
    gravar()
    return
  }
  salvando.value = true
  await new Promise(r => setTimeout(r, 600))
  salvando.value = false
  if (gravar()) toast.add({ title: props.t.formulario.salvo, icon: 'i-lucide-circle-check', color: 'success' })
}

/** Grava e abre a conferência da categoria; o painel do formulário fecha para ela ter a tela. */
function conferir() {
  if (!gravar() || !rascunho.value) return
  const id = rascunho.value.id
  formularioAberto.value = null
  setTimeout(() => abrirConferencia(id), 250)
}

/** Grava a escolha antes de sair: o fluxo precisa saber que é ele quem responde. */
function abrirFluxo() {
  if (gravar()) ir('spaceflow', { no: 'responder' })
}

function abrirPagina() {
  if (!gravar()) return
  passoPublico.value = 'formulario'
  formularioAberto.value = null
  ir('publico')
}

const qr = ref<InstanceType<typeof QrCode> | null>(null)

/** Formulário recém-criado na jornada: ainda não houve envio, aceito ou barrado. */
const semHistorico = computed(() => emCriacao.value || (!!inicioDoCanal.value && rascunho.value?.id === ID_DO_CANAL))

/* ---------- volume das últimas 24 h ---------- */

const totalAceitos = volume24h.reduce((s, h) => s + h.aceitos, 0)
const totalBarrados = volume24h.reduce((s, h) => s + h.barrados, 0)
const maiorBarrado = Math.max(...volume24h.map(h => h.barrados))
/** Escala logarítmica: o pico de robô não pode apagar as horas normais. */
function intensidade(n: number) {
  return n === 0 ? 0 : Math.max(0.12, Math.log10(n + 1) / Math.log10(maiorBarrado + 1))
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
          <UButton :label="t.categoria.criar" color="success" variant="soft" size="xs" @click="criarFormulario()" />
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
            <span class="flex flex-wrap items-center gap-1.5">
              <UBadge :label="t.categoria.visibilidades[(row as Linha).visibilidade]" :color="corDaVisibilidade[(row as Linha).visibilidade]" variant="subtle" size="sm" />
              <!-- PROPOSTA: as 2 configurações novas aparecem como selos à parte -->
              <UBadge v-if="(row as Linha).semLogin" :label="t.categoria.seloSemLogin" icon="i-lucide-link" color="neutral" variant="outline" size="sm" :class="marca" />
              <UBadge v-if="(row as Linha).anonimas" :label="t.categoria.seloAnonimas" icon="i-lucide-venetian-mask" color="info" variant="subtle" size="sm" :class="marca" />
            </span>
          </template>
        </EnTable>
        <p class="mt-3 text-center text-xs text-muted">{{ t.categoria.mostrando(linhas.length) }}</p>
      </div>
    </template>

    <!-- Painel de edição do formulário (cópia do develop + as 3 configurações) -->
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
                <UFormField :label="t.formulario.nome" required :error="erroNome ? t.formulario.nomeObrigatorio : undefined">
                  <UInput v-model="rascunho.nome" class="w-full" autofocus />
                </UFormField>
                <UFormField :label="t.formulario.descricao">
                  <UInput v-model="rascunho.descricao" :placeholder="t.formulario.porFavorDigite" :maxlength="300" class="w-full">
                    <template #trailing><span class="text-xs text-dimmed">{{ rascunho.descricao.length }} / 300</span></template>
                  </UInput>
                </UFormField>
                <UFormField :label="t.formulario.tipo">
                  <USelect v-model="rascunho.tipo" :items="tipos" class="w-full" />
                </UFormField>
                <UFormField :label="t.formulario.visibilidade" :help="t.formulario.ajudaVisibilidade[rascunho.visibilidade]">
                  <USelect v-model="rascunho.visibilidade" :items="visibilidades" class="w-full" />
                </UFormField>

                <!-- PROPOSTA: acesso pelo link, só com Público -->
                <Transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="opacity-0 -translate-y-1"
                  leave-active-class="transition duration-100 ease-in"
                  leave-to-class="opacity-0"
                >
                  <div v-if="publico" class="flex flex-col gap-4" :class="marca">
                    <UFormField :label="t.formulario.acesso.titulo">
                      <URadioGroup v-model="acesso" :items="acessos" variant="card" orientation="horizontal" :ui="{ description: 'text-toned', item: 'flex-1' }" />
                    </UFormField>

                    <section class="flex gap-4 rounded-lg border border-default p-3">
                      <div class="flex min-w-0 flex-1 flex-col gap-2">
                        <p class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-link" class="size-4 text-muted" />{{ t.formulario.link.titulo }}</p>
                        <UInput :model-value="linkDoFormulario(rascunho)" readonly class="w-full" :ui="{ base: 'font-mono text-xs' }" />
                        <p class="text-xs text-toned">{{ semLogin ? t.formulario.link.ajudaSemLogin : t.formulario.link.ajuda }}</p>
                        <div class="flex flex-wrap gap-2">
                          <UButton icon="i-lucide-copy" :label="t.formulario.link.copiar" color="neutral" variant="outline" size="sm" @click="copiar(linkDoFormulario(rascunho))" />
                          <UButton icon="i-lucide-external-link" :label="t.formulario.link.abrirPagina" color="neutral" variant="outline" size="sm" @click="abrirPagina" />
                        </div>
                      </div>
                      <div class="flex w-32 shrink-0 flex-col items-center gap-2">
                        <QrCode ref="qr" :texto="rascunho.identification" :rotulo="t.formulario.link.qrCode" class="size-28" />
                        <p class="text-center text-[11px] text-toned">{{ t.formulario.link.qrAjuda }}</p>
                        <UButton icon="i-lucide-download" :label="t.formulario.link.baixarQr" color="neutral" variant="outline" size="xs" @click="qr?.baixar()" />
                      </div>
                    </section>
                  </div>
                </Transition>

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
                <UFormField
                  :label="t.formulario.avancado.triagem"
                  :hint="t.formulario.avancado.triagemAjuda"
                  :help="semLogin ? t.formulario.avancado.triagemSemLogin : undefined"
                >
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
                  :help="anonimas ? t.formulario.avancado.rascunhoAnonimo : t.formulario.avancado.rascunhosAjuda"
                  :class="anonimas ? marca : ''"
                >
                  <USwitch v-model="rascunho.rascunhos" :disabled="anonimas" />
                </UFormField>

                <USeparator />

                <!-- PROPOSTA: respostas anônimas -->
                <section id="fa-respostas-anonimas" class="flex scroll-mt-4 flex-col gap-4" :class="marca">
                  <div class="flex items-start gap-3">
                    <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-info/15"><UIcon name="i-lucide-venetian-mask" class="size-4 text-info" /></span>
                    <div class="min-w-0 flex-1">
                      <p class="text-sm font-semibold text-highlighted">{{ t.formulario.anonimas.titulo }}</p>
                      <p class="mt-0.5 text-xs text-toned">{{ t.formulario.anonimas.descricao }}</p>
                    </div>
                    <USwitch v-model="rascunho.respostasAnonimas" :aria-label="t.formulario.anonimas.titulo" />
                  </div>

                  <Transition
                    enter-active-class="transition duration-200 ease-out"
                    enter-from-class="opacity-0 -translate-y-1"
                    leave-active-class="transition duration-100 ease-in"
                    leave-to-class="opacity-0"
                  >
                    <div v-if="anonimas" class="flex flex-col gap-4 border-l-2 border-info/30 pl-4">
                      <div class="rounded-lg bg-elevated/60 p-3">
                        <p class="mb-2 text-xs font-semibold text-highlighted">{{ t.formulario.anonimas.oQueMuda }}</p>
                        <ul class="flex flex-col gap-1.5">
                          <li v-for="(m, i) in t.formulario.anonimas.muda" :key="i" class="flex items-start gap-2 text-xs text-toned">
                            <UIcon :name="i === 0 ? 'i-lucide-user-round' : 'i-lucide-check'" class="mt-0.5 size-3.5 shrink-0 text-info" />
                            <span>{{ m }}<span v-if="i === 0" class="ml-1 font-mono text-highlighted">({{ ANONYMOUS.nome }})</span></span>
                          </li>
                        </ul>
                      </div>

                      <!-- Conferência da categoria -->
                      <div
                        class="flex flex-wrap items-center gap-3 rounded-lg border p-3"
                        :class="rascunho.anonimatoAtivo ? 'border-success/40 bg-success/5' : 'border-warning/40 bg-warning/5'"
                      >
                        <UIcon :name="rascunho.anonimatoAtivo ? 'i-lucide-shield-check' : 'i-lucide-shield-alert'" class="size-4 shrink-0" :class="rascunho.anonimatoAtivo ? 'text-success' : 'text-warning'" />
                        <p class="min-w-0 flex-1 text-xs text-highlighted">{{ rascunho.anonimatoAtivo ? t.formulario.anonimas.ativa : t.formulario.anonimas.pendente }}</p>
                        <UButton v-if="!rascunho.anonimatoAtivo" icon="i-lucide-scan-search" :label="t.formulario.anonimas.conferir" color="neutral" variant="outline" size="xs" @click="conferir" />
                      </div>

                      <!-- Acompanhamento, opcional -->
                      <UFormField id="fa-acompanhamento" class="scroll-mt-4" :label="t.formulario.anonimas.acompanhamento[0]" :help="t.formulario.anonimas.acompanhamento[1]">
                        <USwitch v-model="rascunho.acompanhamento" />
                      </UFormField>

                      <Transition
                        enter-active-class="transition duration-200 ease-out"
                        enter-from-class="opacity-0 -translate-y-1"
                        leave-active-class="transition duration-100 ease-in"
                        leave-to-class="opacity-0"
                      >
                        <div v-if="rascunho.acompanhamento" class="flex flex-col gap-4">
                          <p class="flex items-center gap-2 text-sm font-semibold text-highlighted"><UIcon name="i-lucide-message-square-reply" class="size-4 text-muted" />{{ t.formulario.anonimas.retornoTitulo }}</p>
                          <!-- Um ou outro: quem confirma o recebimento -->
                          <UFormField :label="t.formulario.anonimas.retornoModo">
                            <URadioGroup v-model="rascunho.retorno" :items="modosDeRetorno" variant="card" :ui="{ description: 'text-toned' }" />
                          </UFormField>
                          <Transition
                            mode="out-in"
                            enter-active-class="transition duration-200 ease-out"
                            enter-from-class="opacity-0 -translate-y-1"
                            leave-active-class="transition duration-100 ease-in"
                            leave-to-class="opacity-0"
                          >
                            <UFormField v-if="rascunho.retorno === 'automatico'" key="auto" :label="t.formulario.anonimas.mensagemConfirmacao" :help="t.formulario.anonimas.mensagemAjuda">
                              <UTextarea v-model="rascunho.mensagemDeConfirmacao" :rows="3" autoresize class="w-full" />
                            </UFormField>
                            <div v-else key="fluxo" class="flex flex-wrap items-start gap-3 rounded-lg border border-default bg-elevated/50 p-3">
                              <UIcon name="i-lucide-workflow" class="mt-0.5 size-4 shrink-0 text-primary" />
                              <p class="min-w-0 flex-1 text-xs text-toned">{{ t.formulario.anonimas.retornoSpaceflowAviso }}</p>
                              <UButton icon="i-lucide-arrow-right" :label="t.formulario.anonimas.abrirFluxo" color="neutral" variant="outline" size="xs" @click="abrirFluxo" />
                            </div>
                          </Transition>
                          <UFormField :label="t.formulario.anonimas.prazoDeRetorno" :help="t.formulario.anonimas.prazoAjuda">
                            <USelect v-model="rascunho.prazoDeRetornoDias" :items="prazos" class="w-48" />
                          </UFormField>
                          <UFormField :label="t.formulario.anonimas.avisoPorEmail" :help="t.formulario.anonimas.avisoAjuda">
                            <USwitch v-model="rascunho.oferecerAvisoPorEmail" />
                          </UFormField>
                          <UFormField v-if="rascunho.oferecerAvisoPorEmail" :label="t.formulario.anonimas.apagarEmail">
                            <USelect v-model="rascunho.apagarEmail" :items="apagarOpcoes" class="w-72" />
                          </UFormField>
                        </div>
                      </Transition>
                    </div>
                  </Transition>
                </section>

                <!-- PROPOSTA: proteção, só com acesso sem login -->
                <template v-if="semLogin">
                  <USeparator />
                  <section id="fa-protecao" class="flex scroll-mt-4 flex-col gap-4" :class="marca">
                    <div class="flex items-start gap-3">
                      <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15"><UIcon name="i-lucide-shield-check" class="size-4 text-primary" /></span>
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-semibold text-highlighted">{{ t.formulario.protecao.titulo }}</p>
                        <p class="mt-0.5 text-xs text-toned">{{ t.formulario.protecao.ajuda }}</p>
                      </div>
                    </div>
                    <UFormField :label="t.formulario.protecao.verificacao">
                      <URadioGroup v-model="rascunho.verificacao" :items="verificacoes" variant="card" :ui="{ description: 'text-toned' }" />
                    </UFormField>
                    <div class="grid grid-cols-2 gap-3">
                      <UFormField :label="t.formulario.protecao.limitePorHora">
                        <UInputNumber v-model="rascunho.limitePorHora" :min="1" :max="1000" class="w-full" />
                      </UFormField>
                      <UFormField :label="t.formulario.protecao.limitePorDia">
                        <UInputNumber v-model="rascunho.limitePorDia" :min="1" :max="10000" class="w-full" />
                      </UFormField>
                    </div>
                    <p class="-mt-2 text-xs text-toned">{{ t.formulario.protecao.limiteAjuda }}</p>
                    <UFormField :label="t.formulario.protecao.pausarNoPico" :help="t.formulario.protecao.pausarAjuda">
                      <USwitch v-model="rascunho.pausarNoPico" />
                    </UFormField>

                    <!-- Volume -->
                    <div class="rounded-lg border border-default p-3">
                      <div class="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                        <span class="text-xs font-medium text-toned">{{ t.formulario.protecao.ultimas24h }}</span>
                        <span class="flex gap-3 text-xs">
                          <span class="flex items-center gap-1.5 text-toned"><span class="size-2 rounded-full bg-success" />{{ t.formulario.protecao.aceitos(semHistorico ? 0 : totalAceitos) }}</span>
                          <span class="flex items-center gap-1.5 text-toned"><span class="size-2 rounded-full bg-error" />{{ t.formulario.protecao.barrados(semHistorico ? 0 : totalBarrados) }}</span>
                        </span>
                      </div>
                      <div class="flex h-10 items-end gap-0.5" role="img" :aria-label="`${t.formulario.protecao.aceitos(totalAceitos)}, ${t.formulario.protecao.barrados(totalBarrados)}`">
                        <UTooltip v-for="h in volume24h" :key="h.hora" :text="`${h.hora}h · ${t.formulario.protecao.legendaAceitos} ${h.aceitos} · ${t.formulario.protecao.legendaBarrados} ${h.barrados}`">
                          <span class="flex h-full flex-1 flex-col justify-end gap-px">
                            <span class="w-full rounded-t-sm bg-error transition-all" :style="{ height: semHistorico ? '0' : `${intensidade(h.barrados) * 70}%` }" />
                            <span class="w-full rounded-sm bg-success" :style="{ height: !semHistorico && h.aceitos ? `${10 + h.aceitos * 8}%` : '2px', opacity: !semHistorico && h.aceitos ? 1 : 0.25 }" />
                          </span>
                        </UTooltip>
                      </div>
                      <div class="mt-1 flex justify-between text-[10px] text-toned"><span>0h</span><span>12h</span><span>23h</span></div>
                      <p v-if="!semHistorico" class="mt-2 flex items-center gap-1.5 text-xs text-toned"><UIcon name="i-lucide-octagon-pause" class="size-3.5 text-warning" />{{ t.formulario.protecao.picoAs(3) }}</p>
                    </div>
                  </section>
                </template>

                <UButton :label="t.formulario.salvar" :loading="salvando" block color="success" @click="salvar" />
              </div>
            </template>
          </UTabs>
        </div>
      </template>
    </USlideover>
  </div>
</template>

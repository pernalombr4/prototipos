<script setup lang="ts">
/**
 * PROPOSTA. A trilha da aba Releases, montada com a mesma árvore da página de hoje do `en-docs`
 * (`app/pages/releases/[section].vue`, lido em origin/main 910960b4): `UChangelogVersions` com
 * `indicator-motion` e 1 `UChangelogVersion` por versão, com os mesmos `:ui` (container
 * `max-w-2xl`, título `text-2xl`, descrição `line-clamp-4`) e o `ReleaseNotesBanner` no `#image`.
 *
 * O que se acrescenta:
 * - rótulos no `#badge`: o tamanho técnico (major, minor, patch), Exige ação com o prazo, Em breve,
 *   Liberando, Beta ou Acesso antecipado, Liberado para alguns workspaces e as funcionalidades;
 * - 1 barra acima da lista: o tamanho da versão (Todas, Grandes, Médias, Pequenas, com dica) e a
 *   funcionalidade (rodada 3: sai o filtro por tipo de item e o "Só o que exige ação");
 * - o link permanente de cada versão e o acesso a "Próximas mudanças" e a "Assinar";
 * - clicar na versão abre a página da versão, com a lista dos itens (rodada 3; antes abria o post do mês).
 */
import BannerDaRelease from './_BannerDaRelease.vue'
import { modulos, mudancaAberta, mudancas, type ChaveDeModulo } from './mocks'
import { formatarData, type Textos } from './textos'
import { montarVersoes, type Tamanho } from './versoes'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  /** Id da versão a mostrar: limpa os filtros, rola até ela e acende o contorno. */
  destaque: string | null
}>()

const emit = defineEmits<{
  abrirVersao: [versao: string]
  copiar: [versao: string]
  verMudanca: [id: string]
  irProximas: []
  assinar: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]

/* ---------------- Filtros ---------------- */
const tamanho = ref<'todas' | Tamanho>('todas')
const modulosEscolhidos = ref<ChaveDeModulo[]>([])

const temFiltro = computed(() => tamanho.value !== 'todas' || modulosEscolhidos.value.length > 0)
function limpar() {
  tamanho.value = 'todas'
  modulosEscolhidos.value = []
}

const opcoesDeTamanho = ['todas', 'major', 'minor', 'patch'] as const
const opcoesDeModulo = computed(() => modulos.map(m => ({ label: L(m.nome), value: m.id, icon: m.icone })))

/* ---------------- As versões ---------------- */
const todasAsVersoes = computed(() => montarVersoes(props.t, idioma.value))

/** Em breve no topo; depois da mais nova para a mais antiga, como hoje (date DESC). */
const versoes = computed(() => {
  if (props.estado === 'vazio') return []
  return todasAsVersoes.value
    .filter(v => tamanho.value === 'todas' || v.tamanho === tamanho.value)
    .filter(v => !modulosEscolhidos.value.length || v.itens.some(e => modulosEscolhidos.value.includes(e.modulo)))
    .sort((a, b) => Number(b.emBreve) - Number(a.emBreve) || b.data.localeCompare(a.data) || b.versao.localeCompare(a.versao))
})

const abertas = computed(() => mudancas.filter(mudancaAberta).length)
const moduloDe = (id: ChaveDeModulo) => modulos.find(m => m.id === id)!

/** A data no formato do idioma, em números, sem voltar 1 dia (hoje o site mostra "Dec 7, 2026" para 8 de dezembro). */
const dataDaVersao = (iso: string) => formatarData(iso, idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' })
const diaDoBanner = (iso: string) => formatarData(iso, idioma.value)

/* ---------------- Ir até uma versão ---------------- */
const acesa = ref<string | null>(null)
let apagar: ReturnType<typeof setTimeout> | undefined
watch(() => props.destaque, async (id) => {
  if (!id) return
  limpar()
  await nextTick()
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  acesa.value = id
  clearTimeout(apagar)
  apagar = setTimeout(() => { acesa.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div>
    <!-- Barra acima da lista, na coluna do conteúdo (max-w-2xl, como a versão) -->
    <div class="mx-auto mb-12 flex max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <UFieldGroup size="sm" :aria-label="t.releases.tamanho">
          <UTooltip v-for="op in opcoesDeTamanho" :key="op" :text="t.releases.dicaDoTamanho[op]" :delay-duration="200">
            <UButton
              :label="t.releases.tamanhos[op]"
              :color="tamanho === op ? 'primary' : 'neutral'"
              :variant="tamanho === op ? 'solid' : 'outline'"
              :aria-pressed="tamanho === op"
              class="cursor-pointer"
              @click="tamanho = op"
            />
          </UTooltip>
        </UFieldGroup>

        <USelectMenu
          v-model="modulosEscolhidos"
          :items="opcoesDeModulo"
          value-key="value"
          multiple
          size="sm"
          icon="i-lucide-blocks"
          :placeholder="t.releases.todosModulos"
          :search-input="false"
          :aria-label="t.releases.modulo"
          class="min-w-56"
        >
          <template #default>
            <span v-if="modulosEscolhidos.length" class="truncate text-highlighted">{{ t.releases.modulosEscolhidos(modulosEscolhidos.length) }}</span>
            <span v-else class="truncate text-muted">{{ t.releases.todosModulos }}</span>
          </template>
        </USelectMenu>
      </div>

      <div class="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
        <span aria-live="polite">{{ estado === 'carregando' ? '' : t.releases.contagem(versoes.length) }}</span>
        <UButton
          v-if="temFiltro"
          size="xs"
          color="neutral"
          variant="link"
          icon="i-lucide-x"
          :label="t.releases.limpar"
          class="-ml-1 cursor-pointer"
          @click="limpar"
        />
        <span class="ml-auto flex items-center gap-1">
          <UButton
            size="sm"
            color="neutral"
            variant="link"
            icon="i-lucide-calendar-clock"
            :label="t.releases.abaProximas"
            class="cursor-pointer"
            @click="emit('irProximas')"
          >
            <template #trailing>
              <UBadge v-if="abertas" color="warning" variant="outline" size="sm" class="bg-warning/10 text-highlighted" :label="String(abertas)" />
            </template>
          </UButton>
          <UButton
            size="sm"
            color="neutral"
            variant="link"
            icon="i-lucide-bell-plus"
            :label="t.releases.assinar"
            class="cursor-pointer"
            @click="emit('assinar')"
          />
        </span>
      </div>
    </div>

    <!-- Carregando -->
    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <div v-for="i in 2" :key="i" class="flex flex-col gap-3">
        <USkeleton class="h-7 w-1/3" />
        <USkeleton class="h-4 w-full" />
        <USkeleton class="h-4 w-2/3" />
        <USkeleton class="aspect-[16/9] w-full rounded-lg" />
      </div>
    </div>

    <!-- Vazio: sem versão, ou nenhuma com os filtros -->
    <UEmpty
      v-else-if="!versoes.length"
      class="mx-auto max-w-2xl animate-[entrada_.3s_ease-out_both]"
      :icon="temFiltro ? 'i-lucide-filter-x' : 'i-lucide-rocket'"
      :title="temFiltro ? t.releases.semResultadoTitulo : t.releases.vazioTitulo"
      :description="temFiltro ? t.releases.semResultadoTexto : t.releases.vazioTexto"
      :actions="temFiltro ? [{ label: t.releases.limpar, color: 'neutral', variant: 'outline', onClick: limpar }] : []"
      variant="naked"
    />

    <!-- A linha do tempo de hoje -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="v in versoes"
        :id="v.id"
        :key="v.versao"
        :title="v.titulo"
        :description="v.descricao"
        :date="v.data"
        class="scroll-mt-28 cursor-pointer"
        :ui="{
          container: [
            'max-w-2xl [content-visibility:auto] [contain-intrinsic-size:auto_520px]',
            'rounded-lg outline-offset-8 transition-[outline-color] duration-500',
            acesa === v.id ? 'outline-2 outline-primary' : 'outline-2 outline-transparent',
          ].join(' '),
          meta: 'flex flex-wrap items-center gap-1.5 mb-2',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed line-clamp-4',
          imageWrapper: v.tamanho === 'patch' ? 'relative overflow-hidden rounded-lg aspect-[3/1] sm:aspect-[4/1] mt-5' : undefined,
          dotInner: v.emBreve ? 'size-2 rounded-full bg-dimmed' : undefined,
        }"
        @click="emit('abrirVersao', v.versao)"
      >
        <template #date>
          {{ dataDaVersao(v.data) }}
        </template>

        <template #badge>
          <UBadge color="neutral" variant="subtle" size="sm" :label="v.tamanho" />
          <UBadge
            v-if="v.prazo"
            color="warning"
            variant="outline"
            size="sm"
            icon="i-lucide-triangle-alert"
            class="bg-warning/10 text-highlighted"
            :ui="{ leadingIcon: 'text-warning' }"
            :label="`${t.entrada.exigeAcao} · ${t.entrada.agirAte(formatarData(v.prazo, idioma))}`"
          />
          <UBadge v-if="v.emBreve" color="neutral" variant="subtle" size="sm" icon="i-lucide-calendar-clock" :label="t.entrada.estado['em-breve']" />
          <UBadge v-if="v.liberando" color="info" variant="subtle" size="sm" icon="i-lucide-loader" :label="t.entrada.estado.liberando" />
          <UBadge v-for="a in v.acessos" :key="a" color="secondary" variant="subtle" size="sm" icon="i-lucide-flask-conical" :label="t.entrada.acesso[a]" />
          <UBadge v-if="v.alguns" color="neutral" variant="subtle" size="sm" icon="i-lucide-users" :label="t.entrada.alguns" />
          <UBadge
            v-for="m in v.modulos"
            :key="m"
            color="neutral"
            variant="outline"
            size="sm"
            :icon="moduloDe(m).icone"
            :label="L(moduloDe(m).nome)"
          />
        </template>

        <template v-if="!v.emBreve" #image>
          <BannerDaRelease
            :versao="v.versao"
            :data="diaDoBanner(v.data)"
            :cor="v.cor"
            :compacto="v.tamanho === 'patch'"
            class="h-full"
          />
        </template>

        <!-- O link permanente da versão e o que fazer, quando a versão pede ação -->
        <template #body>
          <div class="mt-3 flex flex-wrap items-center gap-1" @click.stop>
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-list"
              :label="t.releases.verItens(v.itens.length)"
              class="-ml-2 cursor-pointer"
              @click="emit('abrirVersao', v.versao)"
            />
            <UButton
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-link"
              :label="t.entrada.copiarLink"
              class="cursor-pointer"
              @click="emit('copiar', v.versao)"
            />
            <UButton
              v-if="v.mudanca"
              size="xs"
              color="neutral"
              variant="ghost"
              icon="i-lucide-list-checks"
              :ui="{ leadingIcon: 'text-warning' }"
              :label="t.entrada.verOQueFazer"
              class="cursor-pointer"
              @click="emit('verMudanca', v.mudanca!)"
            />
          </div>
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>

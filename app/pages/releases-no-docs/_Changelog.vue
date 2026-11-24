<script setup lang="ts">
/**
 * PROPOSTA, rodada 2. A aba Releases montada com a mesma árvore da página de hoje do `en-docs`
 * (`app/pages/releases/[section].vue`, lido em origin/main 910960b4): `UChangelogVersions` com
 * `indicator-motion` e 1 `UChangelogVersion` por versão, com os mesmos `:ui` (container
 * `max-w-2xl`, título `text-2xl`, descrição `line-clamp-4`) e o `ReleaseNotesBanner` no `#image`.
 *
 * O que se acrescenta, e só isto:
 * - rótulos no `#badge`: o badge que o mapeamento do site já tem ("minor", "patch") e os novos
 *   (Exige ação com o prazo, Em breve, Liberando, Beta ou Acesso antecipado, Liberado para alguns
 *   workspaces e os módulos da versão);
 * - 1 barra de filtros acima da lista (tipo, módulo, "Só o que exige ação");
 * - o link permanente de cada versão e o acesso a "Próximas mudanças" e a "Assinar";
 * - o patch entra na mesma linha do tempo, como versão mais curta, com o banner compacto.
 */
import BannerDaRelease from './_BannerDaRelease.vue'
import { entradas, modulos, mudancaAberta, mudancaDe, mudancas, postsDaProposta, postsDeHoje, type ChaveDeModulo, type Entrada, type Tipo } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  /** Id da versão (ou de um item dela) a mostrar: limpa os filtros, rola até ela e acende o contorno. */
  destaque: string | null
}>()

const emit = defineEmits<{
  copiar: [id: string]
  verMudanca: [id: string]
  verPost: [mes: string]
  irProximas: []
  assinar: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]

/* ---------------- Filtros ---------------- */
const tipo = ref<'todos' | Tipo>('todos')
const modulosEscolhidos = ref<ChaveDeModulo[]>([])
const soAcao = ref(false)

const temFiltro = computed(() => tipo.value !== 'todos' || modulosEscolhidos.value.length > 0 || soAcao.value)
function limpar() {
  tipo.value = 'todos'
  modulosEscolhidos.value = []
  soAcao.value = false
}

const opcoesDeTipo = ['todos', 'novidade', 'melhoria', 'correcao'] as const
const opcoesDeModulo = computed(() => modulos.map(m => ({ label: L(m.nome), value: m.id, icon: m.icone })))

const passa = (e: Entrada) =>
  (tipo.value === 'todos' || e.tipo === tipo.value)
  && (!modulosEscolhidos.value.length || modulosEscolhidos.value.includes(e.modulo))
  && (!soAcao.value || !!e.mudanca)

/* ---------------- As versões ---------------- */
/** A âncora do link permanente da versão: 3.4.2 vira "v3-4-2". */
const ancora = (v: string) => `v${v.replaceAll('.', '-')}`
const tipoDaVersao = (v: string) => (v.endsWith('.0.0') ? 'major' : v.endsWith('.0') ? 'minor' : 'patch')

const todasAsVersoes = computed(() => {
  const mapa = new Map<string, Entrada[]>()
  for (const e of entradas) {
    if (!mapa.has(e.versao)) mapa.set(e.versao, [])
    mapa.get(e.versao)!.push(e)
  }
  return [...mapa.entries()].map(([versao, itens]) => {
    const post = postsDeHoje.find(p => p.versao === versao)
    const emBreve = itens.every(e => e.estado === 'em-breve')
    const data = post?.data ?? itens.map(e => e.data).sort().at(emBreve ? 0 : -1)!
    const contagem = (['novidade', 'melhoria', 'correcao'] as const)
      .map(tp => ({ tp, n: itens.filter(e => e.tipo === tp).length }))
      .filter(x => x.n)
    const prazos = itens.map(e => mudancaDe(e.mudanca)).filter(m => !!m).map(m => m!.fases.obrigatoria).sort()
    const tier = (e: Entrada) => e.tier ?? 9
    return {
      versao,
      id: ancora(versao),
      tipo: tipoDaVersao(versao),
      emBreve,
      data,
      mes: data.slice(0, 7),
      cor: post?.cor ?? (tipoDaVersao(versao) === 'patch' ? 'purple' : 'orange'),
      itens,
      titulo: emBreve ? props.t.releases.emBreveTitulo(versao) : props.t.releases.noAr(versao),
      descricao: [
        emBreve
          ? props.t.releases.emBreveDescricao(formatarData(data, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' }))
          : props.t.releases.resumoDaVersao(itens.length, contagem.map(x => props.t.releases.partes[x.tp](x.n))),
        props.t.releases.inclui(itens.toSorted((a, b) => tier(a) - tier(b)).map(e => L(e.titulo))),
      ].join(' '),
      prazo: prazos[0],
      mudanca: itens.find(e => e.mudanca)?.mudanca,
      liberando: itens.some(e => e.estado === 'liberando'),
      acessos: [...new Set(itens.map(e => e.acesso).filter(a => !!a))] as NonNullable<Entrada['acesso']>[],
      alguns: itens.some(e => e.publico === 'alguns'),
      modulos: [...new Set(itens.map(e => e.modulo))],
      temDestaque: itens.some(e => e.tier === 1 || e.tier === 2),
    }
  })
})

/** Em breve no topo; depois da mais nova para a mais antiga, como hoje (date DESC). */
const versoes = computed(() => {
  if (props.estado === 'vazio') return []
  return todasAsVersoes.value
    .filter(v => v.itens.some(passa))
    .sort((a, b) => Number(b.emBreve) - Number(a.emBreve) || b.data.localeCompare(a.data) || b.versao.localeCompare(a.versao))
})

const mesesComPost = new Set(postsDaProposta.filter(p => p.mes).map(p => p.mes!))
const abertas = computed(() => mudancas.filter(mudancaAberta).length)

/** A data no idioma da página, sem voltar 1 dia (hoje o site mostra "Dec 7, 2026" para 8 de dezembro). */
const dataDaVersao = (iso: string) => formatarData(iso, idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' })
const diaDoBanner = (iso: string) => formatarData(iso, idioma.value)

/* ---------------- Ir até uma versão ---------------- */
const acesa = ref<string | null>(null)
let apagar: ReturnType<typeof setTimeout> | undefined
watch(() => props.destaque, async (id) => {
  if (!id) return
  // O item (do post ou de Próximas mudanças) leva à versão dele.
  const alvo = entradas.find(e => e.id === id) ? ancora(entradas.find(e => e.id === id)!.versao) : id
  limpar()
  await nextTick()
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(alvo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  acesa.value = alvo
  clearTimeout(apagar)
  apagar = setTimeout(() => { acesa.value = null }, 2600)
}, { immediate: true, flush: 'post' })
</script>

<template>
  <div>
    <!-- Barra acima da lista, na coluna do conteúdo (max-w-2xl, como a versão) -->
    <div class="mx-auto mb-12 flex max-w-2xl flex-col gap-3">
      <div class="flex flex-wrap items-center gap-3">
        <UFieldGroup size="sm" :aria-label="t.releases.tipo">
          <UButton
            v-for="op in opcoesDeTipo"
            :key="op"
            :label="t.releases.tipos[op]"
            :color="tipo === op ? 'primary' : 'neutral'"
            :variant="tipo === op ? 'solid' : 'outline'"
            :aria-pressed="tipo === op"
            class="cursor-pointer"
            @click="tipo = op"
          />
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
          class="min-w-48"
        >
          <template #default>
            <span v-if="modulosEscolhidos.length" class="truncate text-highlighted">{{ t.releases.modulosEscolhidos(modulosEscolhidos.length) }}</span>
            <span v-else class="truncate text-muted">{{ t.releases.todosModulos }}</span>
          </template>
        </USelectMenu>

        <USwitch v-model="soAcao" size="sm" :label="t.releases.soExigeAcao" color="warning" />
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

    <!-- Vazio: o estado de hoje (ícone em círculo, título e texto); com filtro, o botão de limpar -->
    <div v-else-if="!versoes.length" class="mx-auto flex max-w-2xl flex-col items-center py-12 text-center animate-[entrada_.3s_ease-out_both]">
      <div class="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10">
        <UIcon :name="temFiltro ? 'i-lucide-filter-x' : 'i-lucide-rocket'" class="size-8 text-primary" />
      </div>
      <h3 class="mb-2 text-lg font-semibold text-highlighted">
        {{ temFiltro ? t.releases.semResultadoTitulo : t.releases.vazioTitulo }}
      </h3>
      <p class="text-muted">
        {{ temFiltro ? t.releases.semResultadoTexto : t.releases.vazioTexto }}
      </p>
      <UButton v-if="temFiltro" :label="t.releases.limpar" color="neutral" variant="outline" class="mt-4 cursor-pointer" @click="limpar" />
    </div>

    <!-- A linha do tempo de hoje -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="v in versoes"
        :id="v.id"
        :key="v.versao"
        :title="v.titulo"
        :description="v.descricao"
        :date="v.data"
        class="scroll-mt-28"
        :class="!v.emBreve && v.temDestaque && mesesComPost.has(v.mes) ? 'cursor-pointer' : ''"
        :ui="{
          container: [
            'max-w-2xl [content-visibility:auto] [contain-intrinsic-size:auto_520px]',
            'rounded-lg outline-offset-8 transition-[outline-color] duration-500',
            acesa === v.id ? 'outline-2 outline-primary' : 'outline-2 outline-transparent',
          ].join(' '),
          meta: 'flex flex-wrap items-center gap-1.5 mb-2',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed line-clamp-4',
          imageWrapper: v.tipo === 'patch' ? 'relative overflow-hidden rounded-lg aspect-[3/1] sm:aspect-[4/1] mt-5' : undefined,
          dotInner: v.emBreve ? 'size-2 rounded-full bg-dimmed' : undefined,
        }"
        @click="!v.emBreve && v.temDestaque && mesesComPost.has(v.mes) && emit('verPost', v.mes)"
      >
        <template #date>
          {{ dataDaVersao(v.data) }}
        </template>

        <!-- Os rótulos: o badge do mapeamento de hoje e os novos -->
        <template #badge>
          <UBadge color="neutral" variant="subtle" size="sm" :label="v.tipo" />
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
            :icon="modulos.find(x => x.id === m)!.icone"
            :label="L(modulos.find(x => x.id === m)!.nome)"
          />
        </template>

        <template v-if="!v.emBreve" #image>
          <BannerDaRelease
            :versao="v.versao"
            :data="diaDoBanner(v.data)"
            :cor="v.cor"
            :compacto="v.tipo === 'patch'"
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
              icon="i-lucide-link"
              :label="t.entrada.copiarLink"
              class="-ml-2 cursor-pointer"
              @click="emit('copiar', v.id)"
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

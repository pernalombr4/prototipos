<script setup lang="ts">
/**
 * PROPOSTA, rodada 4. A trilha da aba Releases é o próprio changelog: o texto de cada versão é lido
 * na linha do tempo, sem abrir outra página. Modelo: o template oficial "Changelog" do Nuxt UI
 * (nuxt-ui-templates/changelog), que põe o texto da versão no `#body` do `UChangelogVersion`.
 * Síntese da pesquisa: pesquisa-de-mercado, runs/2026-11-24-deploy-continuo-e-lancamento,
 * evidencias/notas/changelog-referencias.md, "Proposta para o protótipo".
 *
 * Mantido da página de hoje do `en-docs`: `UChangelogVersions` com `indicator-motion`, 1
 * `UChangelogVersion` por versão, o container `max-w-2xl` e o título `text-2xl`.
 *
 * O que muda:
 * - o `#body` traz o texto da versão como prosa (os componentes Prose do Nuxt UI, os mesmos do texto
 *   de um post): Exige ação (só quando há), Novidades, Melhorias e Correções;
 * - novidade e melhoria: 1 linha em negrito com a funcionalidade e o que muda, 1 a 3 frases e
 *   "Saiba mais"; correção: 1 linha. Beta e "liberado para alguns workspaces" vão no texto do título;
 * - no máximo 2 rótulos por versão: o tamanho (minor, patch) e "Exige ação · Agir até <data>";
 * - sai o banner da versão: ele fica no post do Blog;
 * - o `#footer` tem "Copiar link" e, quando a versão faz parte do post do mês, "Ler o post de lançamento";
 * - âncora por versão (`#v3-4-0`) e por item (o id do item no parágrafo dele).
 */
import ProseA from '@nuxt/ui/runtime/components/prose/A.vue'
import ProseH4 from '@nuxt/ui/runtime/components/prose/H4.vue'
import ProseLi from '@nuxt/ui/runtime/components/prose/Li.vue'
import ProseP from '@nuxt/ui/runtime/components/prose/P.vue'
import ProseStrong from '@nuxt/ui/runtime/components/prose/Strong.vue'
import ProseUl from '@nuxt/ui/runtime/components/prose/Ul.vue'
import { modulos, mudancaAberta, mudancaDe, mudancas, type ChaveDeModulo, type Entrada } from './mocks'
import { formatarData, type Textos } from './textos'
import { montarVersoes, type Tamanho } from './versoes'

const props = defineProps<{
  t: Textos
  estado: 'cheio' | 'vazio' | 'carregando'
  /** Id da versão (`v3-4-0`) ou do item a mostrar: limpa os filtros, rola até ele e acende. */
  destaque: string | null
}>()

const emit = defineEmits<{
  copiar: [versao: string]
  verMudanca: [id: string]
  verPost: [mes: string]
  irProximas: []
  assinar: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const toast = useToast()

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

/* ---------------- As versões e o texto de cada uma ---------------- */
const todasAsVersoes = computed(() => montarVersoes(props.t, idioma.value))

const doFiltro = (e: Entrada) => !modulosEscolhidos.value.length || modulosEscolhidos.value.includes(e.modulo)

/** Em breve no topo; depois da mais nova para a mais antiga, como hoje (date DESC). */
const versoes = computed(() => {
  if (props.estado === 'vazio') return []
  return todasAsVersoes.value
    .filter(v => tamanho.value === 'todas' || v.tamanho === tamanho.value)
    .filter(v => v.itens.some(doFiltro))
    .sort((a, b) => Number(b.emBreve) - Number(a.emBreve) || b.data.localeCompare(a.data) || b.versao.localeCompare(a.versao))
    .map(v => {
      const itens = v.itens.filter(doFiltro)
      return {
        ...v,
        secoes: [
          { chave: 'acao', titulo: props.t.entrada.exigeAcao, itens: itens.filter(e => e.mudanca) },
          { chave: 'novidade', titulo: props.t.releases.tipos.novidade, itens: itens.filter(e => !e.mudanca && e.tipo === 'novidade') },
          { chave: 'melhoria', titulo: props.t.releases.tipos.melhoria, itens: itens.filter(e => !e.mudanca && e.tipo === 'melhoria') },
          { chave: 'correcao', titulo: props.t.releases.tipos.correcao, itens: itens.filter(e => !e.mudanca && e.tipo === 'correcao') },
        ].filter(s => s.itens.length),
      }
    })
})

const abertas = computed(() => mudancas.filter(mudancaAberta).length)

/** O título do item, com Beta, acesso antecipado, liberação aos poucos e público no próprio texto. */
function tituloDoItem(e: Entrada) {
  const extras = [
    e.acesso ? props.t.entrada.acesso[e.acesso] : '',
    e.estado === 'liberando' ? (e.todosAte ? props.t.entrada.paraTodosAte(formatarData(e.todosAte, idioma.value)) : props.t.entrada.estado.liberando) : '',
    e.publico === 'alguns' ? props.t.entrada.alguns : '',
  ].filter(Boolean).map(x => x.charAt(0).toLocaleLowerCase(idioma.value) + x.slice(1))
  return extras.length ? `${L(e.titulo)} (${extras.join(', ')}).` : `${L(e.titulo)}.`
}

const dataLonga = (iso: string) => formatarData(iso, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
/** A data no formato do idioma, em números, sem voltar 1 dia (hoje o site mostra "Dec 7, 2026" para 8 de dezembro). */
const dataDaVersao = (iso: string) => formatarData(iso, idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' })

function foraDoPrototipo() {
  toast.add({ title: props.t.releases.foraDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })
}

/* ---------------- Ir até uma versão ou um item ---------------- */
const aceso = ref<string | null>(null)
let apagar: ReturnType<typeof setTimeout> | undefined
watch(() => props.destaque, async (id) => {
  if (!id) return
  limpar()
  await nextTick()
  await new Promise(r => setTimeout(r, 380))
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: /^v\d/.test(id) ? 'start' : 'center' })
  aceso.value = id
  clearTimeout(apagar)
  apagar = setTimeout(() => { aceso.value = null }, 2600)
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
        <USkeleton class="h-4 w-5/6" />
      </div>
    </div>

    <!-- Vazio: sem versão, ou nenhuma com os filtros -->
    <UEmpty
      v-else-if="!versoes.length"
      class="mx-auto max-w-2xl"
      :icon="temFiltro ? 'i-lucide-filter-x' : 'i-lucide-rocket'"
      :title="temFiltro ? t.releases.semResultadoTitulo : t.releases.vazioTitulo"
      :description="temFiltro ? t.releases.semResultadoTexto : t.releases.vazioTexto"
      :actions="temFiltro ? [{ label: t.releases.limpar, color: 'neutral', variant: 'outline', onClick: limpar }] : []"
      variant="naked"
    />

    <!-- A linha do tempo de hoje, com o texto de cada versão no corpo -->
    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="v in versoes"
        :id="v.id"
        :key="v.versao"
        :title="v.titulo"
        :description="v.descricao"
        :date="v.data"
        class="scroll-mt-28"
        :ui="{
          container: [
            'max-w-2xl rounded-lg outline-offset-8 transition-[outline-color] duration-500',
            aceso === v.id ? 'outline-2 outline-primary' : 'outline-2 outline-transparent',
          ].join(' '),
          meta: 'flex flex-wrap items-center gap-1.5 mb-2',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed',
          footer: 'border-t border-default pt-4 mt-2 flex flex-wrap items-center justify-between gap-2',
          dotInner: v.emBreve ? 'size-2 rounded-full bg-dimmed' : undefined,
        }"
      >
        <template #date>
          {{ dataDaVersao(v.data) }}
        </template>

        <!-- No máximo 2 rótulos: o tamanho e o prazo -->
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
        </template>

        <!-- O texto da versão, como o texto de um post -->
        <template #body>
          <div class="text-default">
            <template v-for="s in v.secoes" :key="s.chave">
              <ProseH4>{{ s.titulo }}</ProseH4>

              <ProseUl v-if="s.chave === 'correcao'">
                <ProseLi
                  v-for="e in s.itens"
                  :id="e.id"
                  :key="e.id"
                  class="scroll-mt-32 rounded-sm transition-colors duration-500"
                  :class="aceso === e.id ? 'bg-primary/10' : ''"
                >
                  {{ L(e.titulo) }}
                </ProseLi>
              </ProseUl>

              <template v-else>
                <ProseP
                  v-for="e in s.itens"
                  :id="e.id"
                  :key="e.id"
                  class="scroll-mt-32 rounded-sm transition-colors duration-500"
                  :class="aceso === e.id ? 'bg-primary/10' : ''"
                >
                  <ProseStrong>{{ tituloDoItem(e) }}</ProseStrong>{{ ' ' }}{{ L(e.resumo) }}
                  <template v-if="mudancaDe(e.mudanca)">
                    {{ ' ' }}<ProseStrong>{{ t.releases.agirAteData(dataLonga(mudancaDe(e.mudanca)!.fases.obrigatoria)) }}</ProseStrong>{{ ' ' }}<ProseA href="#" @click.prevent="emit('verMudanca', mudancaDe(e.mudanca)!.id)">{{ t.entrada.verOQueFazer }}</ProseA>.
                  </template>
                  <template v-if="!v.emBreve">
                    {{ ' ' }}<ProseA href="#" @click.prevent="foraDoPrototipo">{{ t.releases.saibaMais }}</ProseA>
                  </template>
                </ProseP>
              </template>
            </template>
          </div>
        </template>

        <template #footer>
          <UButton
            size="xs"
            color="neutral"
            variant="link"
            icon="i-lucide-link"
            :label="t.entrada.copiarLink"
            class="-ml-2 cursor-pointer"
            @click="emit('copiar', v.versao)"
          />
          <UButton
            v-if="v.emPostDoMes"
            size="xs"
            color="neutral"
            variant="link"
            trailing-icon="i-lucide-arrow-right"
            :label="t.releases.lerPostDeLancamento"
            class="cursor-pointer"
            @click="emit('verPost', v.mes)"
          />
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </div>
</template>

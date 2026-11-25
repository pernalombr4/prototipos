<script setup lang="ts">
/**
 * PROPOSTA (rodada 7). O guia de migração de 1 mudança que exige ação, como página da doc de
 * suporte. Modelo: o guia de atualização da doc do Nuxt (cada mudança com "What Changed",
 * "Reasons for Change" e "Migration Steps") e a página de migração do Nuxt UI (aviso no topo,
 * passos numerados, código em diff, "On this page" à direita).
 *
 * A árvore é a da página de doc do `en-docs`, lida em 2026-11-24 (somente leitura):
 * `app/layouts/docs.vue` (UPage com `UPageAside` e `UContentNavigation` à esquerda) e
 * `app/pages/[section]/[...slug].vue` (UPage em 12 colunas, `UPageHeader` com a trilha, o status e
 * "Copiar texto", `UPageBody`, `UContentSurround` e `UContentToc` à direita). Nada da árvore é proposta.
 *
 * O corpo usa só os componentes Prose que o `en-docs` já renderiza no markdown: `::warning`,
 * `::note`, `::tip`, `::steps`, tabela e bloco de código. Escrever um guia novo não pede código:
 * o modelo do markdown está no `MODELO-EXIGE-ACAO.md` desta pasta.
 *
 * O que só existe por ser protótipo: no `en-docs` cada item do menu tem `path` e a página ativa sai
 * da rota. Aqui o item leva `active` e `onClick`, e o anterior e o próximo levam `#guia-<id>`.
 */
import ProseA from '@nuxt/ui/runtime/components/prose/A.vue'
import ProseCode from '@nuxt/ui/runtime/components/prose/Code.vue'
import ProseH2 from '@nuxt/ui/runtime/components/prose/H2.vue'
import ProseH3 from '@nuxt/ui/runtime/components/prose/H3.vue'
import ProseP from '@nuxt/ui/runtime/components/prose/P.vue'
import ProsePre from '@nuxt/ui/runtime/components/prose/Pre.vue'
import ProseSteps from '@nuxt/ui/runtime/components/prose/Steps.vue'
import ProseStrong from '@nuxt/ui/runtime/components/prose/Strong.vue'
import ProseTable from '@nuxt/ui/runtime/components/prose/Table.vue'
import ProseTbody from '@nuxt/ui/runtime/components/prose/Tbody.vue'
import ProseTd from '@nuxt/ui/runtime/components/prose/Td.vue'
import ProseTh from '@nuxt/ui/runtime/components/prose/Th.vue'
import ProseThead from '@nuxt/ui/runtime/components/prose/Thead.vue'
import ProseTr from '@nuxt/ui/runtime/components/prose/Tr.vue'
import ProseNote from '@nuxt/ui/runtime/components/prose/callout/Note.vue'
import ProseTip from '@nuxt/ui/runtime/components/prose/callout/Tip.vue'
import ProseWarning from '@nuxt/ui/runtime/components/prose/callout/Warning.vue'
import { entradas, linkDoGuia, mudancas, type ChaveDeFase } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  /** O id da mudança. */
  id: string
}>()

const emit = defineEmits<{
  /** Outro guia, pelo menu ou pelo anterior e próximo. */
  abrir: [id: string]
  /** O item que anunciou a mudança, na trilha da aba Releases. */
  irPara: [id: string]
  /** O endereço de um título da página, para copiar. */
  copiar: [url: string, ancora: string]
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]

const m = computed(() => mudancas.find(x => x.id === props.id)!)
const entrada = computed(() => entradas.find(e => e.id === m.value.entrada))
const daSecao = computed(() => mudancas)

const dataLonga = (iso: string) => formatarData(iso, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })
const dataCurta = (iso: string) => formatarData(iso, idioma.value, { day: '2-digit', month: '2-digit', year: 'numeric' })

/** O passo vira título de passo: sem o ponto final, como os títulos da doc do Nuxt. */
const tituloDoPasso = (s: string) => s.replace(/\.$/, '')

const ordemDasFases: ChaveDeFase[] = ['opt-in', 'opt-out', 'obrigatoria']

/* ---------------- A casca da página de doc (en-docs) ---------------- */
const trilha = computed(() => [
  { label: props.t.casca.docs },
  { label: props.t.guia.referencia },
  { label: props.t.guia.trilha },
])

/** O menu da seção: a pasta "Guias de migração", aberta, com o guia atual aceso. */
const menu = computed(() => [{
  title: props.t.guia.trilha,
  defaultOpen: true,
  children: daSecao.value.map(x => ({
    title: L(x.titulo),
    active: x.id === m.value.id,
    onClick: () => emit('abrir', x.id),
  })),
}])

const anteriorEProximo = computed(() => {
  const i = daSecao.value.findIndex(x => x.id === m.value.id)
  const link = (x?: typeof m.value) => x && { title: L(x.titulo), description: L(x.motivo), path: `#guia-${x.id}` }
  return [link(daSecao.value[i - 1]), link(daSecao.value[i + 1])]
})

const indice = computed(() => [
  { id: 'o-que-muda', depth: 2, text: props.t.guia.oQueMuda },
  { id: 'por-que-muda', depth: 2, text: props.t.guia.porQueMuda },
  { id: 'quem-e-afetado', depth: 2, text: props.t.guia.quemEAfetado },
  { id: 'prazo-e-fases', depth: 2, text: props.t.guia.prazoEFases },
  {
    id: 'passos-da-migracao',
    depth: 2,
    text: props.t.guia.passos,
    children: m.value.oQueFazer.map((p, i) => ({ id: `passo-${i + 1}`, depth: 3, text: tituloDoPasso(L(p)) })),
  },
  { id: 'depois-do-prazo', depth: 2, text: props.t.guia.depoisDoPrazo },
])

/* ---------------- Copiar texto e copiar o link de um título ---------------- */
const corpo = ref<HTMLElement | null>(null)
const copiado = ref(false)
async function copiarTexto() {
  try { await navigator.clipboard.writeText(corpo.value?.innerText ?? '') }
  catch { /* sem permissão: o botão ainda mostra o estado */ }
  copiado.value = true
  setTimeout(() => { copiado.value = false }, 2000)
}

/** Os títulos com âncora copiam o endereço do guia com a âncora, como na aba Releases (rodada 5). */
function copiarDoTitulo(ev: MouseEvent) {
  const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('h2 a[href^="#"], h3 a[href^="#"]')
  const ancora = a?.getAttribute('href')?.slice(1)
  if (!ancora) return
  ev.preventDefault()
  emit('copiar', linkDoGuia(idioma.value, m.value, ancora), ancora)
}
</script>

<template>
  <UContainer class="mx-auto w-full max-w-360 px-4 sm:px-6 lg:px-8">
    <UPage :ui="{ center: 'lg:col-span-8' }">
      <!-- en-docs, app/layouts/docs.vue -->
      <template #left>
        <UPageAside class="pt-14 lg:col-span-2 lg:w-[calc(100%+20px)] lg:pr-5">
          <UContentNavigation
            :navigation="menu"
            type="multiple"
            highlight
            highlight-color="primary"
            :level="0"
            :ui="{ linkTrailing: 'after', trigger: 'cursor-pointer font-normal', linkTitle: 'whitespace-normal! text-pretty', link: 'cursor-pointer' }"
          >
            <template #link-title="{ link }">
              <span :title="link.title || ''">{{ link.title }}</span>
            </template>
          </UContentNavigation>
        </UPageAside>
      </template>

      <!-- en-docs, app/pages/[section]/[...slug].vue -->
      <UPage
        :ui="{
          root: 'flex flex-col lg:grid lg:grid-cols-12 lg:gap-8',
          center: 'lg:col-span-9',
          right: 'lg:col-span-3 order-first lg:order-last',
        }"
      >
        <UPageHeader
          :title="L(m.titulo)"
          :description="t.guia.descricao(dataLonga(m.fases.obrigatoria))"
          :ui="{ headline: 'mb-2.5 text-base font-semibold text-primary flex items-center gap-1.5', root: 'lg:pt-14' }"
        >
          <template #headline>
            <div class="flex h-6 flex-col gap-3">
              <UBreadcrumb :items="trilha" />
            </div>
          </template>

          <template #default>
            <div class="mt-4 flex items-center gap-2">
              <UBadge class="font-semibold" :label="t.guia.status" color="info" variant="subtle" size="md" />
              <USeparator orientation="vertical" class="h-4" />
              <UButton
                class="cursor-pointer font-semibold"
                :label="copiado ? t.guia.copiado : t.guia.copiarTexto"
                :icon="copiado ? 'i-lucide-check' : 'i-lucide-copy'"
                :color="copiado ? 'success' : 'neutral'"
                variant="outline"
                size="xs"
                @click="copiarTexto"
              />
            </div>
          </template>
        </UPageHeader>

        <UPageBody>
          <div ref="corpo" @click="copiarDoTitulo">
            <!-- ::warning — o prazo, antes de tudo -->
            <ProseWarning>
              <ProseStrong>{{ t.guia.agirAte(dataLonga(m.fases.obrigatoria)) }}</ProseStrong>{{ ' ' }}{{ L(m.depois) }}
            </ProseWarning>

            <ProseH2 id="o-que-muda" anchor>
              {{ t.guia.oQueMuda }}
            </ProseH2>
            <ProseP>{{ entrada ? L(entrada.resumo) : `${L(m.titulo)}.` }}</ProseP>
            <ProseP v-if="entrada">
              {{ t.guia.anunciadaEm }}{{ ' ' }}<ProseA :href="`#${entrada.id}`" @click.stop.prevent="emit('irPara', entrada.id)">
                {{ L(entrada.titulo) }}
              </ProseA>{{ ' ' }}(<ProseCode>{{ entrada.versao }}</ProseCode>).
            </ProseP>

            <ProseH2 id="por-que-muda" anchor>
              {{ t.guia.porQueMuda }}
            </ProseH2>
            <ProseP>{{ L(m.motivo) }}</ProseP>

            <ProseH2 id="quem-e-afetado" anchor>
              {{ t.guia.quemEAfetado }}
            </ProseH2>
            <ProseP>{{ L(m.quem) }}.</ProseP>

            <ProseH2 id="prazo-e-fases" anchor>
              {{ t.guia.prazoEFases }}
            </ProseH2>
            <ProseTable>
              <ProseThead>
                <ProseTr>
                  <ProseTh>{{ t.guia.colunas.fase }}</ProseTh>
                  <ProseTh>{{ t.guia.colunas.inicio }}</ProseTh>
                  <ProseTh>{{ t.guia.colunas.oQueAcontece }}</ProseTh>
                </ProseTr>
              </ProseThead>
              <ProseTbody>
                <ProseTr v-for="f in ordemDasFases" :key="f">
                  <ProseTd><ProseStrong>{{ t.guia.fases[f] }}</ProseStrong></ProseTd>
                  <ProseTd class="whitespace-nowrap">
                    {{ dataCurta(m.fases[f]) }}
                  </ProseTd>
                  <ProseTd>{{ t.guia.descricaoDaFase[f] }}</ProseTd>
                </ProseTr>
              </ProseTbody>
            </ProseTable>
            <!-- ::note — só quando a data mudou -->
            <ProseNote v-if="m.dataAnterior">
              {{ t.guia.prazoMudou(dataCurta(m.dataAnterior)) }}
            </ProseNote>

            <ProseH2 id="passos-da-migracao" anchor>
              {{ t.guia.passos }}
            </ProseH2>
            <!-- ::steps — cada passo é um título de nível 3, numerado pelo componente -->
            <ProseSteps>
              <template v-for="(p, i) in m.oQueFazer" :key="i">
                <ProseH3 :id="`passo-${i + 1}`" anchor>
                  {{ tituloDoPasso(L(p)) }}
                </ProseH3>
                <ProseP v-if="m.guia.detalhes[i]">
                  {{ L(m.guia.detalhes[i]) }}
                </ProseP>
                <ProsePre
                  v-if="m.guia.codigo?.passo === i"
                  language="diff"
                  :icon="m.guia.codigo.icone"
                  :filename="m.guia.codigo.arquivo"
                  :code="m.guia.codigo.linhas.join('\n')"
                >
                  <code><span
                    v-for="(linha, n) in m.guia.codigo.linhas"
                    :key="n"
                    class="line block"
                    :class="linha.startsWith('+') ? 'text-success' : linha.startsWith('-') ? 'text-error' : ''"
                  >{{ linha }}</span></code>
                </ProsePre>
              </template>
            </ProseSteps>

            <ProseH2 id="depois-do-prazo" anchor>
              {{ t.guia.depoisDoPrazo }}
            </ProseH2>
            <ProseP>{{ L(m.depois) }}</ProseP>

            <!-- ::tip -->
            <ProseTip>
              {{ t.guia.ajuda }}
            </ProseTip>
          </div>

          <USeparator v-if="anteriorEProximo.some(Boolean)" />
          <UContentSurround :surround="anteriorEProximo as any" />
        </UPageBody>

        <template #right>
          <UContentToc
            :links="indice"
            :title="t.guia.nestaPagina"
            :ui="{
              root: 'top-[calc(var(--ui-header-height)+23px)] max-h-[calc(100dvh-var(--ui-header-height)-23px)]',
              linkText: 'whitespace-normal wrap-break-word',
            }"
            highlight
            highlight-color="primary"
            color="primary"
          />
        </template>
      </UPage>
    </UPage>
  </UContainer>
</template>

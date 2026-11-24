<script setup lang="ts">
/**
 * PROPOSTA. O post mensal de lançamento na aba Blog ("Novidades de dezembro").
 *
 * Só os itens Tier 1 (Em destaque) e Tier 2 (Também neste mês) do mês. Correção e Tier 3 ficam no
 * changelog, e o post diz quantos são e leva até lá. O passo a passo e a navegação guiada que o
 * post de hoje já tem continuam no mesmo lugar: abertos no Tier 1, recolhidos no Tier 2.
 *
 * A moldura é a da página de post do `en-docs` (`app/pages/blog/[...slug].vue`, lido em
 * 2026-11-24): voltar ao blog, `UPageHeader` com selo, data e tempo de leitura, o quadro escuro e
 * o conteúdo com "Nesta página" à direita.
 */
import BannerDaRelease from './_BannerDaRelease.vue'
import { entradas, moduloDe, mudancaAberta, mudancaDe, type Entrada, type Post } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{ t: Textos, post: Post }>()

const emit = defineEmits<{
  voltar: []
  verEntrada: [id: string]
  verMudanca: [id: string]
  verChangelog: []
  assinar: []
}>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const data = (iso: string, o?: Intl.DateTimeFormatOptions) => formatarData(iso, idioma.value, o)

const doMes = computed(() => entradas.filter(e => e.data.startsWith(props.post.mes!) && e.estado !== 'em-breve'))
const destaques = computed(() => doMes.value.filter(e => e.tier === 1))
const tambem = computed(() => doMes.value.filter(e => e.tier === 2))
const outros = computed(() => doMes.value.filter(e => e.tier !== 1 && e.tier !== 2))
const acoes = computed(() =>
  doMes.value.map(e => mudancaDe(e.mudanca)).filter((m): m is NonNullable<typeof m> => !!m && mudancaAberta(m)),
)

const sumario = computed(() => [
  ...(acoes.value.length ? [{ id: 'exige-acao', texto: props.t.entrada.exigeAcao, nivel: 2 }] : []),
  { id: 'em-destaque', texto: props.t.post.destaques, nivel: 2 },
  ...destaques.value.map(e => ({ id: `post-${e.id}`, texto: L(e.titulo), nivel: 3 })),
  ...(tambem.value.length ? [{ id: 'tambem', texto: props.t.post.tambem, nivel: 2 }] : []),
  ...tambem.value.map(e => ({ id: `post-${e.id}`, texto: L(e.titulo), nivel: 3 })),
  { id: 'outros', texto: props.t.post.outros, nivel: 2 },
])

function irPara(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const passosAbertos = ref<Record<string, boolean>>({})
const rotuloDoMes = computed(() => { const m = data(props.post.data, { month: 'long', year: 'numeric' }); return m.charAt(0).toUpperCase() + m.slice(1) })
const etiquetas = (e: Entrada) => [
  { icon: moduloDe(e.modulo).icone, label: L(moduloDe(e.modulo).nome), color: 'neutral' as const, variant: 'outline' as const },
  ...(e.acesso ? [{ icon: 'i-lucide-flask-conical', label: props.t.entrada.acesso[e.acesso], color: 'secondary' as const, variant: 'subtle' as const }] : []),
  ...(e.publico === 'alguns' ? [{ icon: 'i-lucide-users', label: props.t.entrada.alguns, color: 'neutral' as const, variant: 'subtle' as const }] : []),
  ...(e.mudanca ? [{ icon: 'i-lucide-triangle-alert', label: props.t.entrada.exigeAcao, color: 'warning' as const, variant: 'outline' as const, class: 'bg-warning/10 text-highlighted', ui: { leadingIcon: 'text-warning' } }] : []),
]
</script>

<template>
  <UContainer class="animate-[entrada_.35s_ease-out_both] pb-24">
    <UButton
      color="neutral"
      variant="link"
      icon="i-lucide-arrow-left"
      :label="t.blog.voltar"
      class="mt-6 -ml-2.5 cursor-pointer"
      @click="emit('voltar')"
    />

    <UPageHeader :title="L(post.titulo)" :description="L(post.descricao)" :ui="{ root: 'border-none pt-6' }">
      <template #headline>
        <div class="flex flex-wrap items-center gap-2 text-sm text-muted">
          <UIcon name="i-lucide-rocket" class="text-primary" />
          <UBadge color="primary" variant="subtle" :label="t.blog.mensais" />
          <span>{{ data(post.data, { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
          <span aria-hidden="true">·</span>
          <span class="flex items-center gap-1"><UIcon name="i-lucide-clock" class="text-xs" />{{ t.blog.minLeitura(post.minutos ?? 5) }}</span>
        </div>
      </template>
    </UPageHeader>

    <BannerDaRelease
      :rotulo="rotuloDoMes"
      :subtitulo="t.blog.bannerSubtitulo"
      :data="data(post.data, { day: 'numeric', month: 'long', year: 'numeric' })"
      :cor="post.cor"
      class="mb-10"
    />

    <div class="flex flex-col gap-10 lg:grid lg:grid-cols-12 lg:gap-10">
      <article class="flex flex-col gap-12 lg:col-span-9">
        <!-- Exige ação -->
        <section v-if="acoes.length" id="exige-acao" class="scroll-mt-32">
          <UAlert
            color="warning"
            variant="subtle"
            icon="i-lucide-triangle-alert"
            :title="t.post.exigeAcao(acoes.length, data(acoes[0]!.fases.obrigatoria))"
            :description="L(acoes[0]!.titulo)"
            :actions="[{ label: t.post.verChangelog, color: 'neutral', variant: 'outline', trailingIcon: 'i-lucide-arrow-right', onClick: () => emit('verMudanca', acoes[0]!.id) }]"
          />
        </section>

        <!-- Em destaque: Tier 1, com passo a passo e navegação guiada abertos -->
        <section id="em-destaque" class="flex scroll-mt-32 flex-col gap-10">
          <h2 class="text-2xl font-bold text-highlighted">
            {{ t.post.destaques }}
          </h2>

          <div v-for="e in destaques" :id="`post-${e.id}`" :key="e.id" class="flex scroll-mt-32 flex-col gap-4">
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="b in etiquetas(e)" :key="b.label" size="sm" v-bind="b" />
            </div>
            <h3 class="text-xl font-semibold text-highlighted">
              {{ L(e.titulo) }}
            </h3>
            <p class="text-default">
              {{ L(e.resumo) }}
            </p>

            <div v-if="e.passos">
              <h4 class="mb-3 flex items-center gap-2 font-semibold text-highlighted">
                <UIcon name="i-lucide-clipboard-list" class="text-primary" />
                {{ t.post.passoAPasso }}
              </h4>
              <ol class="grid gap-4 sm:grid-cols-2">
                <li v-for="(p, i) in e.passos" :key="i" class="flex flex-col gap-2">
                  <p class="flex gap-2 text-sm font-medium text-highlighted">
                    <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-inverted">{{ i + 1 }}</span>
                    {{ L(p.titulo) }}
                  </p>
                  <div class="flex aspect-video items-center justify-center rounded-lg border border-dashed border-accented bg-elevated text-xs text-dimmed">
                    <span class="flex items-center gap-1.5"><UIcon name="i-lucide-image" class="size-4" />{{ t.post.imagemDoPasso }}</span>
                  </div>
                </li>
              </ol>
            </div>

            <div v-if="e.navegacaoGuiada">
              <h4 class="mb-2 flex items-center gap-2 font-semibold text-highlighted">
                <UIcon name="i-lucide-map" class="text-primary" />
                {{ t.post.navegacaoGuiada }}
              </h4>
              <p class="mb-3 text-sm text-muted">
                {{ t.post.navegacaoAviso }}
              </p>
              <div class="flex aspect-video items-center justify-center rounded-lg border border-dashed border-accented bg-elevated text-sm text-dimmed">
                <span class="flex items-center gap-2"><UIcon name="i-lucide-mouse-pointer-click" class="size-5" />{{ t.post.areaInterativa }}</span>
              </div>
            </div>

            <div class="flex flex-wrap gap-2">
              <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-list" :label="t.post.verChangelog" class="cursor-pointer" @click="emit('verEntrada', e.id)" />
            </div>
          </div>
        </section>

        <!-- Também neste mês: Tier 2, com o passo a passo recolhido -->
        <section v-if="tambem.length" id="tambem" class="flex scroll-mt-32 flex-col gap-8 border-t border-default pt-10">
          <h2 class="text-2xl font-bold text-highlighted">
            {{ t.post.tambem }}
          </h2>
          <div v-for="e in tambem" :id="`post-${e.id}`" :key="e.id" class="flex scroll-mt-32 flex-col gap-3">
            <div class="flex flex-wrap gap-1.5">
              <UBadge v-for="b in etiquetas(e)" :key="b.label" size="sm" v-bind="b" />
            </div>
            <h3 class="text-lg font-semibold text-highlighted">
              {{ L(e.titulo) }}
            </h3>
            <p class="text-default">
              {{ L(e.resumo) }}
            </p>

            <UCollapsible v-if="e.passos" v-model:open="passosAbertos[e.id]">
              <UButton
                size="sm"
                color="primary"
                variant="ghost"
                icon="i-lucide-clipboard-list"
                trailing-icon="i-lucide-chevron-down"
                :label="t.post.verPassos(e.passos.length)"
                class="-ml-2.5 cursor-pointer"
                :ui="{ trailingIcon: ['transition-transform duration-200', passosAbertos[e.id] ? 'rotate-180' : ''].join(' ') }"
              />
              <template #content>
                <ol class="mt-3 grid gap-4 sm:grid-cols-3">
                  <li v-for="(p, i) in e.passos" :key="i" class="flex flex-col gap-2">
                    <p class="flex gap-2 text-sm font-medium text-highlighted">
                      <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-inverted">{{ i + 1 }}</span>
                      {{ L(p.titulo) }}
                    </p>
                    <div class="flex aspect-video items-center justify-center rounded-lg border border-dashed border-accented bg-elevated text-xs text-dimmed">
                      <UIcon name="i-lucide-image" class="size-4" />
                    </div>
                  </li>
                </ol>
              </template>
            </UCollapsible>

            <div class="flex flex-wrap gap-2">
              <UButton size="sm" color="neutral" variant="outline" icon="i-lucide-list" :label="t.post.verChangelog" class="cursor-pointer" @click="emit('verEntrada', e.id)" />
            </div>
          </div>
        </section>

        <!-- Correções e o resto: só a contagem e o caminho para o changelog -->
        <section id="outros" class="scroll-mt-32 border-t border-default pt-10">
          <h2 class="mb-2 text-2xl font-bold text-highlighted">
            {{ t.post.outros }}
          </h2>
          <p class="mb-4 text-default">
            {{ t.post.outrosTexto(outros.length) }}
          </p>
          <UButton color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" :label="t.post.verChangelog" class="cursor-pointer" @click="emit('verChangelog')" />
        </section>

        <!-- Inscrição -->
        <UPageCTA
          :title="t.post.assineTitulo"
          :description="t.post.assineTexto"
          variant="subtle"
          :ui="{ container: 'py-8 sm:py-10 lg:py-12 gap-4', title: 'text-xl sm:text-2xl', description: 'text-base mt-2' }"
          :links="[{ label: t.releases.assinar, icon: 'i-lucide-mail', class: 'cursor-pointer', onClick: () => emit('assinar') }]"
        />
      </article>

      <!-- Nesta página -->
      <aside class="order-first lg:order-last lg:col-span-3">
        <nav class="lg:sticky lg:top-[calc(var(--ui-header-height)+2.5rem)]" :aria-label="t.post.nestaPagina">
          <p class="mb-3 text-sm font-semibold text-highlighted">
            {{ t.post.nestaPagina }}
          </p>
          <ul class="flex flex-col gap-2 border-l border-default text-sm">
            <li v-for="s in sumario" :key="s.id">
              <a
                :href="`#${s.id}`"
                class="-ml-px block border-l border-transparent text-muted transition-colors hover:border-primary hover:text-primary"
                :class="s.nivel === 3 ? 'pl-6' : 'pl-3'"
                @click.prevent="irPara(s.id)"
              >{{ s.texto }}</a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  </UContainer>
</template>

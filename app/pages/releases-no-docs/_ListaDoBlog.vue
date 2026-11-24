<script setup lang="ts">
/**
 * A lista da aba Blog, nos 2 modos do andaime.
 *
 * Hoje: cópia de `app/pages/blog/[section].vue` do `en-docs` (lido em 2026-11-24): filtro de
 * categoria (Todas, Artigos, Releases), o post mais novo em destaque (`UPageCTA`) e os outros em
 * cards (`UBlogPost`). O post mais novo é sempre "<versão> está no ar".
 *
 * Proposta: a mesma página, com o post mensal ("Novidades de dezembro") no lugar do post por versão.
 * A categoria "Releases" vira "Novidades do mês", e os posts por versão que já existem ficam nela,
 * com o selo "Arquivo". O quadro escuro mostra o mês no lugar da versão.
 */
import BannerDaRelease from './_BannerDaRelease.vue'
import type { Post } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{
  t: Textos
  modo: 'hoje' | 'proposta'
  posts: Post[]
  estado: 'cheio' | 'vazio' | 'carregando'
}>()

const emit = defineEmits<{ abrir: [id: string] }>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]

/** Na proposta, o post por versão antigo entra na mesma categoria do post mensal. */
const categoriaDe = (p: Post) => (props.modo === 'proposta' && p.categoria === 'release' ? 'mensal' : p.categoria)

const categoria = ref<'todas' | Post['categoria']>('todas')
watch(() => props.modo, () => { categoria.value = 'todas' })

const categorias = computed(() => {
  const existentes = new Set(props.posts.map(categoriaDe))
  return (['todas', 'artigo', props.modo === 'hoje' ? 'release' : 'mensal'] as const).filter(c => c === 'todas' || existentes.has(c))
})
const rotulo = (c: string) => ({ todas: props.t.blog.todas, artigo: props.t.blog.artigos, release: props.t.blog.releases, mensal: props.t.blog.mensais } as Record<string, string>)[c]!

const lista = computed(() => {
  if (props.estado === 'vazio') return []
  return props.posts
    .filter(p => categoria.value === 'todas' || categoriaDe(p) === categoria.value)
    .toSorted((a, b) => b.data.localeCompare(a.data))
})

const primeiro = computed(() => lista.value[0])
const temBanner = (p: Post) => p.categoria !== 'artigo'
const maiuscula = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const rotuloDoBanner = (p: Post) =>
  p.categoria === 'mensal' ? maiuscula(formatarData(p.data, idioma.value, { month: 'long', year: 'numeric' })) : undefined
/** Rodada 4: o banner mostra o mês e o ano ("Dezembro de 2026") e, no canto, a data com o ano. */
const dataDoBanner = (p: Post) => formatarData(p.data, idioma.value, { day: 'numeric', month: 'long', year: 'numeric' })

/** O texto do botão do destaque, como no site: "Ver release" ou "Ler artigo"; na proposta, "Ler o post". */
const rotuloDoLink = (p: Post) =>
  p.categoria === 'artigo' ? props.t.blog.lerArtigo : props.modo === 'hoje' ? props.t.blog.verRelease : props.t.blog.lerPost

function abrir(p?: Post) {
  if (p?.abre || (p && props.modo === 'hoje' && p === primeiro.value)) emit('abrir', p.id)
}
</script>

<template>
  <div>
    <!-- Filtro de categoria (cópia do site) -->
    <UContainer class="mb-8">
      <div class="flex flex-wrap items-center gap-2">
        <span class="mr-2 text-sm font-medium text-muted">{{ t.blog.categorias }}:</span>
        <UButton
          v-for="c in categorias"
          :key="c"
          :label="rotulo(c)"
          :color="categoria === c ? 'primary' : 'neutral'"
          :variant="categoria === c ? 'solid' : 'ghost'"
          size="sm"
          class="cursor-pointer"
          @click="categoria = c"
        />
      </div>
    </UContainer>

    <UContainer v-if="estado === 'carregando'" class="flex flex-col gap-10" aria-busy="true">
      <USkeleton class="h-80 w-full rounded-xl" />
      <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
        <USkeleton v-for="i in 3" :key="i" class="h-64 rounded-xl" />
      </div>
    </UContainer>

    <!-- Estado vazio (cópia do site) -->
    <UContainer v-else-if="!lista.length">
      <UEmpty icon="i-lucide-notebook-pen" :title="t.blog.semArtigos" :description="t.blog.novosEmBreve" variant="naked" />
    </UContainer>

    <template v-else>
      <UPageSection :ui="{ container: 'py-0 sm:py-0 lg:py-0' }">
        <UPageCTA
          :key="`${modo}-${primeiro!.id}`"
          :title="L(primeiro!.titulo)"
          :description="L(primeiro!.descricao)"
          orientation="horizontal"
          variant="outline"
          class="animate-[entrada_.35s_ease-out_both]"
          :ui="{ root: 'ring-primary/30' }"
          :links="primeiro!.abre || modo === 'hoje'
            ? [{ label: rotuloDoLink(primeiro!), trailingIcon: 'i-lucide-arrow-right', class: 'text-sm font-semibold cursor-pointer', onClick: () => abrir(primeiro) }]
            : []"
        >
          <BannerDaRelease
            v-if="temBanner(primeiro!)"
            :versao="primeiro!.versao"
            :rotulo="rotuloDoBanner(primeiro!)"
            :subtitulo="primeiro!.categoria === 'mensal' ? t.blog.bannerSubtitulo : 'Release Notes'"
            :data="dataDoBanner(primeiro!)"
            :cor="primeiro!.cor"
          />
        </UPageCTA>
      </UPageSection>

      <UContainer class="mt-12">
        <UBlogPosts :ui="{ base: 'flex flex-col gap-10 sm:grid sm:grid-cols-2 lg:grid-cols-3 lg:gap-y-16' }">
          <UBlogPost
            v-for="(p, i) in lista.slice(1)"
            :key="`${modo}-${p.id}`"
            :title="L(p.titulo)"
            :description="L(p.descricao)"
            :date="p.data"
            orientation="vertical"
            variant="subtle"
            class="animate-[entrada_.35s_ease-out_both]"
            :class="p.abre ? 'cursor-pointer transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10' : ''"
            :style="{ animationDelay: `${i * 60}ms` }"
            :role="p.abre ? 'link' : undefined"
            :tabindex="p.abre ? 0 : undefined"
            @click="abrir(p)"
            @keydown.enter="abrir(p)"
          >
            <template v-if="temBanner(p)" #header>
              <BannerDaRelease
                compacto
                :versao="p.versao"
                :rotulo="rotuloDoBanner(p)"
                :subtitulo="p.categoria === 'mensal' ? t.blog.bannerSubtitulo : 'Release Notes'"
                :cor="p.cor"
              />
            </template>
            <template #badge>
              <div class="flex items-center gap-2">
                <div class="flex size-9 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
                  <UIcon :name="p.categoria === 'artigo' ? 'i-lucide-notebook-pen' : 'i-lucide-rocket'" class="text-base text-primary" />
                </div>
                <UBadge
                  v-if="modo === 'proposta' && p.categoria === 'release'"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  :label="t.blog.arquivo"
                />
                <UBadge
                  v-else-if="p.categoria !== 'artigo'"
                  color="neutral"
                  variant="subtle"
                  size="sm"
                  :label="modo === 'hoje' ? 'minor' : t.blog.mensais"
                />
              </div>
            </template>
          </UBlogPost>
        </UBlogPosts>
      </UContainer>
    </template>
  </div>
</template>

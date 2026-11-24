<script setup lang="ts">
/**
 * A aba Releases como ela é hoje, para o modo "Hoje" do andaime. Nada aqui é proposta.
 *
 * Cópia de `app/pages/releases/[section].vue` do `en-docs` (lido em 2026-11-24): a linha do tempo
 * `UChangelogVersions` com 1 entrada por versão minor, título "<versão> está no ar", resumo de até
 * 4 linhas e o quadro escuro com a versão. As versões antigas sem post (2.2.0 a 2.4.5) ficam de fora.
 *
 * Os 2 defeitos de data que a pesquisa achou no site estão reproduzidos de propósito, para a
 * comparação ficar honesta: a data sai 1 dia antes e em formato inglês ("Dec 7, 2026").
 */
import BannerDaRelease from './_BannerDaRelease.vue'
import { postsDeHoje } from './mocks'
import { formatarData, type Textos } from './textos'

const props = defineProps<{ t: Textos, estado: 'cheio' | 'vazio' | 'carregando' }>()

const idioma = useIdioma()
const L = (x: Record<string, string>) => x[idioma.value]
const toast = useToast()

const versoes = computed(() => (props.estado === 'vazio' ? [] : postsDeHoje.filter(p => p.categoria === 'release')))

/** Como o site mostra: 1 dia antes (fuso) e em inglês, qualquer que seja o idioma. */
function dataComDefeito(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })
}
function diaDoBanner(iso: string) {
  const d = new Date(`${iso}T12:00:00Z`)
  d.setUTCDate(d.getUTCDate() - 1)
  return formatarData(d.toISOString().slice(0, 10), idioma.value)
}
</script>

<template>
  <UContainer>
    <div v-if="estado === 'carregando'" class="mx-auto flex max-w-2xl flex-col gap-10" aria-busy="true">
      <USkeleton v-for="i in 2" :key="i" class="h-96 w-full rounded-xl" />
    </div>

    <UEmpty v-else-if="!versoes.length" icon="i-lucide-rocket" :title="t.blog.semArtigos" variant="naked" />

    <UChangelogVersions v-else indicator-motion :ui="{ container: 'flex flex-col gap-y-10 sm:gap-y-14 lg:gap-y-18' }">
      <UChangelogVersion
        v-for="(v, i) in versoes"
        :key="v.id"
        :title="L(v.titulo)"
        :description="L(v.descricao)"
        :date="v.data"
        class="animate-[entrada_.35s_ease-out_both] cursor-pointer"
        :style="{ animationDelay: `${i * 80}ms` }"
        :ui="{
          container: 'max-w-2xl [content-visibility:auto] [contain-intrinsic-size:auto_520px]',
          title: 'text-2xl font-bold text-highlighted',
          description: 'text-base text-muted mt-2 leading-relaxed line-clamp-4',
        }"
        @click="toast.add({ title: t.blog.postForaDoPrototipo, icon: 'i-lucide-info', color: 'neutral', duration: 2500 })"
      >
        <template #date>
          {{ dataComDefeito(v.data) }}
        </template>
        <template #image>
          <BannerDaRelease :versao="v.versao" :data="diaDoBanner(v.data)" :cor="v.cor" class="h-full" />
        </template>
      </UChangelogVersion>
    </UChangelogVersions>
  </UContainer>
</template>

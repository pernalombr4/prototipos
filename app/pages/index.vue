<script setup lang="ts">
// Índice automático: lê as rotas e agrupa por protótipo (primeiro segmento da URL).
// Não precisa manter lista à mão — criou a pasta em app/pages/, apareceu aqui.
const router = useRouter()

interface Tela { path: string, titulo: string }
interface Prototipo {
  slug: string
  titulo: string
  descricao: string
  status: NonNullable<import('#app').PageMeta['status']>
  atualizado: string
  telas: Tela[]
}

const prototipos = computed<Prototipo[]>(() => {
  const grupos = new Map<string, Prototipo>()

  for (const rota of router.getRoutes()) {
    if (rota.path === '/' || rota.path.includes(':')) continue
    const slug = rota.path.split('/').filter(Boolean)[0]
    if (!slug) continue

    const meta = rota.meta
    if (!grupos.has(slug)) {
      grupos.set(slug, {
        slug,
        titulo: slug,
        descricao: '',
        status: 'rascunho',
        atualizado: '',
        telas: [],
      })
    }
    const grupo = grupos.get(slug)!

    // A tela raiz do protótipo (/slug) manda nos dados do card.
    if (rota.path === `/${slug}`) {
      grupo.titulo = meta.titulo ?? slug
      grupo.descricao = meta.descricao ?? ''
      grupo.status = meta.status ?? 'rascunho'
      grupo.atualizado = meta.atualizado ?? ''
    }
    grupo.telas.push({ path: rota.path, titulo: meta.tela ?? meta.titulo ?? rota.path })
  }

  return [...grupos.values()].sort((a, b) => b.atualizado.localeCompare(a.atualizado))
})

const corDoStatus = {
  rascunho: 'neutral',
  'em-revisao': 'warning',
  aprovado: 'success',
  arquivado: 'neutral',
} as const
</script>

<template>
  <UContainer class="py-12">
    <div class="mb-10">
      <h1 class="text-3xl font-bold text-highlighted">
        Protótipos ENSPACE
      </h1>
      <p class="mt-2 text-muted">
        Alta fidelidade em Nuxt UI, mesmo tema do produto. Cada protótipo tem o briefing,
        a pesquisa de referência e o histórico de iterações na própria pasta.
      </p>
    </div>

    <!-- Um protótipo, um card, UMA porta de entrada. A navegação entre as telas
         de um protótipo acontece dentro dele, nunca aqui. -->
    <UPageGrid v-if="prototipos.length">
      <NuxtLink
        v-for="(proto, i) in prototipos"
        :key="proto.slug"
        :to="`/${proto.slug}`"
        class="group block animate-[entrada_0.45s_ease-out_both] rounded-xl border border-default bg-elevated/30 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary hover:shadow-lg hover:shadow-primary/5"
        :style="{ animationDelay: `${i * 70}ms` }"
      >
        <div class="flex items-start justify-between gap-3">
          <h2 class="font-semibold text-highlighted transition-colors group-hover:text-primary">
            {{ proto.titulo }}
          </h2>
          <UBadge :color="corDoStatus[proto.status]" variant="subtle" size="sm">
            {{ proto.status }}
          </UBadge>
        </div>

        <p v-if="proto.descricao" class="mt-2 text-sm text-muted">
          {{ proto.descricao }}
        </p>

        <div class="mt-5 flex items-center justify-between">
          <span v-if="proto.atualizado" class="text-xs text-dimmed">
            Atualizado em {{ proto.atualizado }}
          </span>
          <span class="flex items-center gap-1.5 text-sm font-medium text-primary">
            Abrir protótipo
            <UIcon
              name="i-lucide-arrow-right"
              class="size-4 transition-transform duration-200 group-hover:translate-x-1"
            />
          </span>
        </div>
      </NuxtLink>
    </UPageGrid>

    <UEmpty
      v-else
      icon="i-lucide-frame"
      title="Nenhum protótipo ainda"
      description="Crie app/pages/<slug>/index.vue com definePageMeta e ele aparece aqui sozinho."
    />
  </UContainer>
</template>

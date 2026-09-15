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

    <UPageGrid v-if="prototipos.length">
      <UCard v-for="proto in prototipos" :key="proto.slug">
        <template #header>
          <div class="flex items-start justify-between gap-3">
            <h2 class="font-semibold text-highlighted">
              {{ proto.titulo }}
            </h2>
            <UBadge :color="corDoStatus[proto.status]" variant="subtle" size="sm">
              {{ proto.status }}
            </UBadge>
          </div>
        </template>

        <p v-if="proto.descricao" class="text-sm text-muted">
          {{ proto.descricao }}
        </p>

        <div class="mt-4 flex flex-wrap gap-2">
          <UButton
            v-for="tela in proto.telas"
            :key="tela.path"
            :to="tela.path"
            :label="tela.titulo"
            color="neutral"
            variant="subtle"
            size="xs"
          />
        </div>

        <template v-if="proto.atualizado" #footer>
          <span class="text-xs text-dimmed">Atualizado em {{ proto.atualizado }}</span>
        </template>
      </UCard>
    </UPageGrid>

    <UEmpty
      v-else
      icon="i-lucide-frame"
      title="Nenhum protótipo ainda"
      description="Crie app/pages/<slug>/index.vue com definePageMeta e ele aparece aqui sozinho."
    />
  </UContainer>
</template>

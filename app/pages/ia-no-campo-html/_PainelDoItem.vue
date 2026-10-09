<script setup lang="ts">
/**
 * O painel de informações do item, à esquerda das folders.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Cópia de `pastas-do-item/_PainelDoItem.vue`
 * (08/10/2026), que foi copiado da preview
 * `/workspaces/enspace-releases/types/teste_tutorial_contratos/<referência>`
 * em 08/10/2026: ícone, referência, categoria, os 3 grupos (Identificação,
 * Origem, Histórico) e o botão de recolher. Recolhido, vira a coluna de
 * ícones que a barra lateral mostra.
 */
import type { Textos } from './textos'
import { categoria, item } from './mocks'

defineProps<{ t: Textos }>()

const recolhido = defineModel<boolean>('recolhido', { default: false })

const data = (d: Date) => d.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' })

const grupos = computed(() => [
  { titulo: 'identificacao', linhas: [{ icone: 'i-lucide-hash', rotulo: 'id', valor: String(item.id) }] },
  { titulo: 'origem', linhas: [
    { icone: 'i-lucide-activity', rotulo: 'status', valor: 'ativo' },
    { icone: 'i-lucide-mail', rotulo: 'emailDaSolicitacao', valor: item.request_email! },
  ] },
  { titulo: 'historico', linhas: [
    { icone: 'i-lucide-calendar', rotulo: 'criadoEm', valor: data(item.created_at) },
    { icone: 'i-lucide-calendar-clock', rotulo: 'atualizadoEm', valor: data(item.updated_at) },
  ] },
])
</script>

<template>
  <aside
    class="relative flex shrink-0 flex-col border-r border-default bg-default transition-[width] duration-200 ease-out"
    :class="recolhido ? 'w-14' : 'w-58'"
  >
    <!-- Recolhido: a coluna de ícones -->
    <div v-if="recolhido" class="flex flex-col items-center gap-3 py-2.5">
      <span class="flex size-9 items-center justify-center rounded-full ring-2 ring-primary/40">
        <UIcon name="i-lucide-file" class="size-4 text-highlighted" />
      </span>
      <UIcon name="i-lucide-hash" class="mt-2 size-4 text-toned" />
      <UIcon name="i-lucide-activity" class="size-4 text-toned" />
      <UIcon name="i-lucide-calendar-plus" class="size-4 text-toned" />
    </div>

    <!-- Aberto -->
    <div v-else class="flex min-w-0 flex-col gap-3 overflow-y-auto p-3">
      <div class="flex items-start gap-2.5">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full ring-2 ring-default">
          <UIcon name="i-lucide-file" class="size-5 text-highlighted" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="break-all text-sm font-semibold leading-snug text-highlighted">{{ item.reference }}</p>
          <p class="font-mono text-xs text-toned">{{ categoria.name }}</p>
        </div>
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.maisAcoes" />
      </div>
      <UBadge :label="categoria.name" icon="i-lucide-briefcase" color="neutral" variant="soft" size="sm" class="self-start" />

      <section v-for="g in grupos" :key="g.titulo" class="flex flex-col gap-1.5">
        <p class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-toned">
          <span class="size-1 rounded-full bg-primary" />{{ t.painel[g.titulo as 'origem'] }}
        </p>
        <div class="flex flex-col rounded-lg border border-default">
          <div v-for="l in g.linhas" :key="l.rotulo" class="flex gap-2.5 px-3 py-2">
            <UIcon :name="l.icone" class="mt-0.5 size-4 shrink-0 text-muted" />
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase text-muted">{{ t.painel[l.rotulo as 'id'] }}</p>
              <p class="break-all text-sm font-semibold text-highlighted">{{ l.rotulo === 'status' ? t.painel.ativo : l.valor }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>

    <UButton
      :icon="recolhido ? 'i-lucide-chevrons-right' : 'i-lucide-chevrons-left'"
      color="neutral"
      variant="outline"
      size="xs"
      class="absolute -right-3 bottom-16 z-10 rounded-full bg-default"
      :aria-label="recolhido ? t.painel.expandir : t.painel.recolher"
      @click="recolhido = !recolhido"
    />
  </aside>
</template>

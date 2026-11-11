<script setup lang="ts">
/**
 * O painel de informações do item, à esquerda das pastas.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiado do develop em 11/11/2026: ícone, referência,
 * categoria, os 3 grupos (Identificação, Origem, Histórico) e o botão de
 * recolher. Recolhido, vira a coluna de ícones (documento, #, atividade,
 * calendário).
 */
import type { Item } from '@be-enlighten/enspace-sdk-schemas'
import type { Textos } from './textos'

const props = defineProps<{ t: Textos, item: Item, categoria: { slug: string, name: string } }>()

const recolhido = defineModel<boolean>('recolhido', { default: false })

const grupos = computed(() => [
  { titulo: 'identificacao', linhas: [{ icone: 'i-lucide-hash', rotulo: 'id', valor: String(props.item.id) }] },
  { titulo: 'origem', linhas: [
    { icone: 'i-lucide-activity', rotulo: 'status', valor: props.t.painel.ativo },
    { icone: 'i-lucide-mail', rotulo: 'emailSolicitante', valor: props.item.request_email ?? '' },
  ] },
  { titulo: 'historico', linhas: [
    { icone: 'i-lucide-calendar', rotulo: 'criadoEm', valor: props.t.dataLonga(props.item.created_at) },
    { icone: 'i-lucide-calendar-clock', rotulo: 'atualizadoEm', valor: props.t.dataLonga(props.item.updated_at) },
  ] },
])
</script>

<template>
  <aside
    class="relative hidden shrink-0 flex-col border-r border-default bg-default transition-[width] duration-200 ease-out md:flex"
    :class="recolhido ? 'w-12' : 'w-58'"
  >
    <div v-if="recolhido" class="flex flex-col items-center gap-3 py-2.5">
      <span class="flex size-8 items-center justify-center rounded-full ring-2 ring-primary/40">
        <UIcon name="i-lucide-file" class="size-4 text-highlighted" />
      </span>
      <UIcon name="i-lucide-hash" class="mt-2 size-4 text-toned" />
      <UIcon name="i-lucide-activity" class="size-4 text-toned" />
      <UIcon name="i-lucide-calendar-plus" class="size-4 text-toned" />
    </div>

    <div v-else class="flex min-w-0 flex-col gap-3 overflow-y-auto p-3">
      <div class="flex items-start gap-2.5">
        <span class="flex size-10 shrink-0 items-center justify-center rounded-full ring-2 ring-default">
          <UIcon name="i-lucide-file" class="size-5 text-highlighted" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="break-all text-sm font-semibold leading-snug text-highlighted">{{ item.reference }}</p>
          <p class="font-mono text-xs text-toned">{{ categoria.slug }}</p>
        </div>
        <UButton icon="i-lucide-ellipsis-vertical" color="neutral" variant="ghost" size="xs" :aria-label="t.painel.maisAcoes" />
      </div>
      <UBadge :label="categoria.slug" icon="i-lucide-briefcase" color="neutral" variant="outline" size="sm" class="self-start" />

      <section v-for="g in grupos" :key="g.titulo" class="flex flex-col gap-1.5">
        <p class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-toned">
          <span class="size-1 rounded-full bg-primary" />{{ t.painel[g.titulo as 'origem'] }}
        </p>
        <div class="flex flex-col rounded-lg border border-default">
          <div v-for="l in g.linhas" :key="l.rotulo" class="flex gap-2.5 px-3 py-2">
            <UIcon :name="l.icone" class="mt-0.5 size-4 shrink-0 text-muted" />
            <div class="min-w-0">
              <p class="text-[10px] font-semibold uppercase text-muted">{{ t.painel[l.rotulo as 'id'] }}</p>
              <p class="break-all text-sm font-semibold text-highlighted">{{ l.valor }}</p>
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

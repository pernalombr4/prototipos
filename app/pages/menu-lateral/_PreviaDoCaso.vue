<script setup lang="ts">
import type { CasoDeUso } from './casos'

/**
 * A "imagem" de um caso de uso (rodada 18).
 *
 * O ClickUp mostra prints de cada modelo. O protótipo não tem prints de
 * telas que ainda não existem, então desenha a miniatura com o PRÓPRIO
 * conteúdo do caso: os menus e as telas que ele traz, os status, os campos
 * da categoria. É o que a pessoa precisa ver para decidir, e muda de verdade
 * de um caso para outro, em vez de um retângulo genérico.
 *
 * Quatro quadros, e só entram os que o caso tem:
 *   menu      a barra com os menus e as telas, e uma lista ao lado;
 *   quadro    os status em colunas;
 *   ficha     os campos da categoria;
 *   painel    barras de um gráfico, quando há tela de painel.
 */
const props = defineProps<{
  caso: CasoDeUso
  quadro: 'menu' | 'quadro' | 'ficha' | 'painel'
  /** Grande: na galeria do detalhe e na ampliação. */
  grande?: boolean
}>()

/* Cores dos status, da paleta semântica, em ordem. */
const tons = ['bg-primary/20', 'bg-secondary/20', 'bg-warning/25', 'bg-success/20', 'bg-error/15']
const tela = computed(() => props.caso.menus[0]?.telas[0]?.rotulo ?? props.caso.categorias[0]?.nome ?? props.caso.nome)
const campos = computed(() => props.caso.categorias[0]?.campos ?? [])
const alturas = [55, 80, 40, 95, 65, 75]
</script>

<template>
  <div
    class="flex h-full w-full overflow-hidden rounded-md border border-default bg-default text-left"
    :class="props.grande ? 'text-sm lg:text-base' : 'text-[7px]'"
    aria-hidden="true"
  >
    <!-- ======== menu ======== -->
    <template v-if="props.quadro === 'menu'">
      <div class="w-1/3 shrink-0 space-y-[0.4em] border-r border-default bg-elevated/60 p-[0.8em]">
        <template v-for="m in props.caso.menus" :key="m.rotulo">
          <p class="truncate font-semibold uppercase tracking-wide text-toned">{{ m.rotulo }}</p>
          <p
            v-for="(x, i) in m.telas"
            :key="x.rotulo"
            class="flex items-center gap-[0.4em] truncate rounded px-[0.4em] py-[0.15em] text-default"
            :class="i === 0 ? 'bg-primary/10 font-semibold' : ''"
          >
            <UIcon :name="x.icone" class="size-[1.2em] shrink-0" />
            <span class="truncate">{{ x.rotulo }}</span>
          </p>
        </template>
        <template v-if="!props.caso.menus.length">
          <p v-for="c in props.caso.categorias" :key="c.nome" class="flex items-center gap-[0.4em] truncate text-default">
            <UIcon :name="c.icone" class="size-[1.2em] shrink-0" />{{ c.nome }}
          </p>
        </template>
      </div>
      <div class="min-w-0 flex-1 p-[0.8em]">
        <p class="mb-[0.6em] truncate font-semibold text-highlighted">{{ tela }}</p>
        <div v-for="n in 6" :key="n" class="flex items-center gap-[0.6em] border-b border-default py-[0.35em]">
          <span class="h-[0.5em] flex-1 rounded-full bg-accented" :style="{ maxWidth: `${40 + (n * 13) % 50}%` }" />
          <span
            v-if="props.caso.status.length"
            class="truncate rounded px-[0.4em] text-default"
            :class="tons[n % props.caso.status.length]"
          >{{ props.caso.status[n % props.caso.status.length] }}</span>
        </div>
      </div>
    </template>

    <!-- ======== quadro: os status em colunas ======== -->
    <div v-else-if="props.quadro === 'quadro'" class="flex min-w-0 flex-1 gap-[0.6em] bg-elevated/40 p-[0.8em]">
      <div v-for="(st, i) in props.caso.status" :key="st" class="min-w-0 flex-1 space-y-[0.4em]">
        <p class="truncate rounded px-[0.4em] font-semibold text-default" :class="tons[i % tons.length]">{{ st }}</p>
        <div v-for="n in (4 - (i % 3))" :key="n" class="space-y-[0.3em] rounded border border-default bg-default p-[0.4em]">
          <span class="block h-[0.45em] rounded-full bg-accented" />
          <span class="block h-[0.45em] w-2/3 rounded-full bg-accented/70" />
        </div>
      </div>
    </div>

    <!-- ======== ficha: os campos da categoria ======== -->
    <div v-else-if="props.quadro === 'ficha'" class="min-w-0 flex-1 p-[1em]">
      <p class="mb-[0.8em] flex items-center gap-[0.4em] font-semibold text-highlighted">
        <UIcon :name="props.caso.categorias[0]?.icone ?? 'i-lucide-folder'" class="size-[1.3em]" />
        {{ props.caso.categorias[0]?.nome }}
      </p>
      <div class="grid grid-cols-2 gap-x-[1em] gap-y-[0.6em]">
        <div v-for="c in campos" :key="c" class="min-w-0">
          <p class="truncate text-toned">{{ c }}</p>
          <span class="mt-[0.2em] block h-[1.6em] rounded border border-default bg-elevated/50" />
        </div>
      </div>
    </div>

    <!-- ======== painel: um gráfico de barras ======== -->
    <div v-else class="flex min-w-0 flex-1 flex-col p-[1em]">
      <p class="mb-[0.6em] truncate font-semibold text-highlighted">{{ props.caso.menus.flatMap(m => m.telas).find(x => x.tipoDeTela === 'paineis')?.rotulo }}</p>
      <div class="flex flex-1 items-end gap-[0.8em] border-b border-l border-default px-[0.6em]">
        <span
          v-for="(h, i) in alturas"
          :key="i"
          class="flex-1 rounded-t"
          :class="i % 2 ? 'bg-secondary/40' : 'bg-primary/40'"
          :style="{ height: `${h}%` }"
        />
      </div>
    </div>
  </div>
</template>

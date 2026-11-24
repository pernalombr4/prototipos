<script setup lang="ts">
/**
 * Cópia do `ReleaseNotesBanner.vue` do `en-docs` (lido em 2026-11-24): o quadro escuro com o
 * logo, a versão e "RELEASE NOTES".
 *
 * Nada aqui é proposta, com 1 exceção declarada: a prop `rotulo`. No post mensal, o quadro mostra
 * o mês ("Dezembro") no lugar da versão, porque o post deixa de ser de uma versão. O componente é o
 * mesmo; só o texto do meio muda.
 *
 * Diferenças de cópia, declaradas no DECISOES.md: o logo vem do `enspace.svg` local (o site busca
 * uma imagem no CDN, e o protótipo não faz rede), e as estrelas do `StarsBg` viraram pontos fixos.
 */
import logoEnspace from './enspace.svg'

const props = withDefaults(defineProps<{
  versao?: string
  rotulo?: string
  subtitulo?: string
  data?: string
  cor?: 'purple' | 'cyan' | 'teal' | 'fuchsia' | 'orange' | 'red'
  compacto?: boolean
}>(), { subtitulo: 'Release Notes', cor: 'purple', compacto: false })


/** As 3 nebulosas de cada cor, como no site, com a cor do tema no lugar do rgba fixo. */
const esquemas = {
  purple: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-purple-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-fuchsia-500)_20%,transparent)_0%,transparent_70%)]', 'text-purple-300'],
  cyan: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-cyan-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-blue-500)_20%,transparent)_0%,transparent_70%)]', 'text-cyan-300'],
  teal: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-teal-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-emerald-500)_20%,transparent)_0%,transparent_70%)]', 'text-teal-300'],
  fuchsia: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-fuchsia-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-pink-500)_20%,transparent)_0%,transparent_70%)]', 'text-fuchsia-300'],
  orange: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-orange-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-amber-500)_20%,transparent)_0%,transparent_70%)]', 'text-orange-300'],
  red: ['bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-red-600)_25%,transparent)_0%,transparent_70%)]', 'bg-[radial-gradient(circle,color-mix(in_oklab,var(--color-rose-500)_20%,transparent)_0%,transparent_70%)]', 'text-red-300'],
} as const
const esquema = computed(() => esquemas[props.cor] ?? esquemas.purple)

/** Estrelas fixas, sempre nas mesmas posições (sem aleatório: o servidor e o navegador desenham igual). */
const estrelas = Array.from({ length: 36 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53 + 11) % 100}%`,
  opacity: 0.25 + ((i * 7) % 6) / 10,
}))
</script>

<template>
  <div
    class="relative flex items-center justify-center overflow-hidden bg-space-950"
    :class="compacto ? 'h-full min-h-40 px-4 py-6' : 'min-h-72 rounded-2xl px-6 py-12 sm:min-h-80'"
  >
    <span
      v-for="(e, i) in estrelas"
      :key="i"
      aria-hidden="true"
      class="absolute size-px rounded-full bg-white"
      :style="{ left: e.left, top: e.top, opacity: e.opacity }"
    />
    <div aria-hidden="true" class="pointer-events-none absolute inset-0">
      <div :class="esquema[0]" class="absolute -top-16 -right-16 size-80" />
      <div :class="esquema[1]" class="absolute -bottom-20 -left-10 size-96" />
    </div>

    <span v-if="data" class="absolute top-4 right-5 z-10 text-[10px] font-medium tracking-wider text-white/40 uppercase sm:text-xs">
      {{ data }}
    </span>

    <div class="relative z-10 flex flex-col items-center text-center" :class="compacto ? 'gap-1.5' : 'gap-4 sm:gap-5'">
      <img :src="logoEnspace" alt="ENSPACE" :class="compacto ? 'h-4' : 'h-7 sm:h-8'">
      <div
        v-if="versao || rotulo"
        class="relative flex items-center justify-center rounded-lg border border-space-500/30 bg-space-500/20 backdrop-blur-xs"
        :class="compacto ? 'px-2 py-1' : 'px-4 py-2'"
      >
        <span class="relative font-bold" :class="[esquema[2], compacto ? 'text-2xl' : 'text-5xl sm:text-6xl']">
          {{ rotulo ?? `v${versao}` }}
        </span>
      </div>
      <p class="font-semibold tracking-[0.4em] text-primary-100 uppercase" :class="compacto ? 'text-[8px]' : 'text-[10px] sm:text-xs'">
        {{ subtitulo }}
      </p>
    </div>
  </div>
</template>

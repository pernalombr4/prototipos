<script setup lang="ts">
/**
 * ✅ PROPOSTA C: o mapa do menu.
 *
 * O menu lateral do ENSPACE desenhado dentro da página, com cada item levando
 * à página dele na doc. É o espelho da B usado como índice, e não como barra:
 * na página larga ele cabe em 2 colunas, sem rolar, e a barra da doc continua
 * curta (a da A).
 *
 * O desenho dos itens é o da B (ícone, nome, submenu aberto com traço à
 * esquerda). Só os submenus que o produto tem aparecem.
 */
import type { BlocoDoMapa, ItemDoMapa, Lingua } from './mocks'
import { paginas } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  l: Lingua
  blocos: BlocoDoMapa[]
}>()

const emit = defineEmits<{ abrir: [paginaId: string] }>()

function nome(item: ItemDoMapa) {
  return item.rotulo?.[props.l] ?? paginas.get(item.pagina)?.titulo[props.l] ?? item.pagina
}

/**
 * Onde cada bloco fica, na ordem do produto. Em 2 colunas: Membro, e embaixo
 * Ajuda e Menu do perfil, de um lado; Configurações do outro. A partir de
 * 1280 px, 3 colunas, e o mapa encurta para a altura de Configurações.
 */
const grupos = computed(() => [
  { classe: 'sm:col-start-1 sm:row-start-1', chaves: ['membro'] },
  { classe: 'sm:col-start-2 sm:row-start-1 sm:row-span-2 xl:row-span-1', chaves: ['configuracoes'] },
  { classe: 'sm:col-start-1 sm:row-start-2 xl:col-start-3 xl:row-start-1', chaves: ['ajuda', 'perfil'] },
].map(g => ({ classe: g.classe, blocos: props.blocos.filter(b => g.chaves.includes(b.chave)) })))

const item = 'group flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 text-left text-sm transition-colors hover:bg-elevated hover:text-highlighted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
</script>

<template>
  <section class="mb-10 rounded-xl border border-default bg-elevated/30 p-4 sm:p-5">
    <div class="mb-4 flex items-start gap-3">
      <div class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
        <UIcon name="i-lucide-map" class="size-5 text-primary" />
      </div>
      <div>
        <h2 class="text-lg font-bold text-highlighted">{{ t.mapa.titulo }}</h2>
        <p class="text-sm text-muted">{{ t.mapa.ajuda }}</p>
      </div>
    </div>

    <div class="grid items-start gap-x-4 gap-y-2 sm:grid-cols-2 xl:grid-cols-3">
      <div v-for="(grupo, g) in grupos" :key="g" class="flex flex-col gap-2" :class="grupo.classe">
        <div
          v-for="(bloco, b) in grupo.blocos"
          :key="bloco.chave"
          class="rounded-lg bg-default p-2 ring-1 ring-default"
          :style="{ animation: 'entrada 300ms ease-out both', animationDelay: `${(g + b) * 60}ms` }"
        >
          <p class="px-2.5 pb-1 pt-1 text-xs font-medium text-muted">{{ t.mapa.blocos[bloco.chave] }}</p>
          <ul class="flex flex-col gap-0.5">
            <li v-for="i in bloco.itens" :key="i.pagina">
              <button type="button" :class="[item, 'py-1 text-toned']" @click="emit('abrir', i.pagina)">
                <UIcon v-if="i.icone" :name="i.icone" class="size-4.5 shrink-0 text-muted group-hover:text-primary" />
                <span class="min-w-0 flex-1">{{ nome(i) }}</span>
                <UIcon name="i-lucide-arrow-right" class="size-3.5 shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </button>
              <ul v-if="i.filhos?.length" class="ms-4.5 mt-0.5 flex flex-col gap-0.5 border-s border-default ps-2">
                <li v-for="f in i.filhos" :key="f.pagina">
                  <button type="button" :class="[item, 'py-0.5 text-muted']" @click="emit('abrir', f.pagina)">
                    <span class="min-w-0 flex-1">{{ nome(f) }}</span>
                    <UIcon name="i-lucide-arrow-right" class="size-3.5 shrink-0 text-primary opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

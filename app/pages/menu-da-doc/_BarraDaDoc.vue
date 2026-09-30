<script setup lang="ts">
/**
 * A barra da documentação com os componentes do Nuxt UI, como o en-docs usa:
 * `UContentSearchButton` e `UContentNavigation`. Nada de componente próprio.
 *
 * HOJE (casca): as props do `app/layouts/docs.vue` do en-docs (`type="single"`,
 * `highlight`, `highlight-color="primary"`, `level 0`, sem `default-open`, o
 * `ui` com `linkTrailing` e `trigger` e o slot `link-title` que põe o nome
 * inteiro no `title`), mais o ajuste de tema do `app/app.config.ts` de lá
 * (`listWithChildren: 'ms-2 border-s border-default'`), aplicado aqui pelo `ui`
 * do componente para não mexer no tema dos outros protótipos.
 *
 * B (proposta): o padrão da doc do Nuxt (nuxt.com usa `:collapsible="false"`),
 * com uma diferença que a nossa árvore exige: níveis dentro dos grupos.
 * Com `:collapsible="false"`, o componente trava TODOS os níveis. Então:
 *   - o grupo é um item de 1º nível com `disabled: true`, que o tema desenha
 *     igual ao título de grupo do nuxt.com (seminegrito, sem hover). A seta sai
 *     pelo `ui` do próprio item;
 *   - os níveis de dentro continuam recolhíveis, e `defaultOpen` de cada item
 *     abre o ramo da página atual;
 *   - a página índice de cada pasta é o 1º filho, "Visão geral", e a de
 *     cada grupo, "Sobre esta seção" (no en-docs, é o `navigation.title` do
 *     índice, sem código). O grupo não usa "Visão geral" porque Configurações
 *     tem a tela Visão Geral;
 *   - o nome longo quebra linha (`ui.linkTitle`).
 *
 * O que só existe por ser protótipo: no en-docs cada item tem `path` e o
 * componente acha a página ativa pela rota. Aqui a doc inteira é uma página
 * só, então o item leva `active` e `onClick` (campos do próprio item).
 */
import type { Lingua, Menu, No } from './mocks'
import { caminhoAte, nomeDoNo } from './mocks'
import type { Textos } from './textos'

const props = defineProps<{
  menu: Extract<Menu, 'hoje' | 'b'>
  arvore: No[]
  paginaAtiva: string
  t: Textos
  l: Lingua
  carregando?: boolean
  erro?: boolean
}>()

const emit = defineEmits<{
  abrir: [paginaId: string]
  clique: []
  recarregar: []
}>()

interface Item {
  title: string
  icon?: string
  active?: boolean
  defaultOpen?: boolean
  disabled?: boolean
  class?: string
  ui?: Record<string, string>
  onClick?: () => void
  children?: Item[]
}

function link(pagina: string, title: string, icon?: string): Item {
  const ativo = pagina === props.paginaAtiva
  return {
    title,
    icon,
    active: ativo,
    // Gancho para rolar a barra até o item ativo. Não muda o desenho.
    class: ativo ? 'barra-ativo' : undefined,
    onClick: () => emit('abrir', pagina),
  }
}

/** HOJE: a árvore como o site gera, com o índice como 1º filho da pasta. */
function itemDeHoje(no: No): Item {
  const title = nomeDoNo(no, props.l)
  if (no.tipo === 'pasta') return { title, icon: no.icone, children: (no.filhos ?? []).map(itemDeHoje) }
  return link(no.pagina!, title, no.icone)
}

/** B: grupos travados, níveis de dentro recolhíveis. */
function itemDeB(no: No, nivel: number, noRamo: Set<string>): Item {
  const title = nomeDoNo(no, props.l)
  const icone = nivel === 1 ? no.icone : undefined
  const visaoGeral = (pagina: string) => link(pagina, props.t.barra.visaoGeral)
  const filhos = (no.filhos ?? []).map(f => itemDeB(f, nivel + 1, noRamo))

  if (no.tipo === 'titulo') {
    return {
      title,
      disabled: true,
      ui: { linkTrailingIcon: 'hidden', trigger: 'cursor-default' },
      children: [...(no.pagina ? [link(no.pagina, props.t.barra.sobreASecao)] : []), ...filhos],
    }
  }
  if (filhos.length) {
    return { title, icon: icone, defaultOpen: noRamo.has(no.id), children: [visaoGeral(no.pagina!), ...filhos] }
  }
  return link(no.pagina!, title, icone)
}

const itens = computed<Item[]>(() => {
  if (props.menu === 'hoje') return props.arvore.map(itemDeHoje)
  const noRamo = new Set(caminhoAte(props.arvore, props.paginaAtiva).map(n => n.id))
  return props.arvore.map(no => itemDeB(no, 0, noRamo))
})

/* O `ui` do docs.vue e do app.config do en-docs (casca). Na B, o nome quebra linha. */
const uiDoEnDocs = { linkTrailing: 'after', trigger: 'cursor-pointer', listWithChildren: 'ms-2 border-s border-default' }
const ui = computed(() => props.menu === 'hoje'
  ? uiDoEnDocs
  : { ...uiDoEnDocs, linkTitle: 'whitespace-normal! text-pretty' })

/** Cada clique na barra conta para a tarefa de teste (andaime). */
function aoClicar(e: MouseEvent) {
  const alvo = e.target as HTMLElement
  if (alvo.closest('[data-barra] a, [data-barra] button')) emit('clique')
}

/** Proposta B: a barra rola até o item ativo, que pode estar abaixo da dobra. */
const raizDaBarra = useTemplateRef<HTMLElement>('barra')
onMounted(() => {
  if (props.menu !== 'b') return
  setTimeout(() => {
    const ativo = raizDaBarra.value?.querySelector<HTMLElement>('.barra-ativo')
    if (!ativo) return
    let caixa = ativo.parentElement
    while (caixa && !/(auto|scroll)/.test(getComputedStyle(caixa).overflowY)) caixa = caixa.parentElement
    if (!caixa) return
    const a = ativo.getBoundingClientRect()
    const c = caixa.getBoundingClientRect()
    if (a.top < c.top + 8 || a.bottom > c.bottom - 8) caixa.scrollTop += (a.top - c.top) - c.height / 3
  }, 260)
})
</script>

<template>
  <div ref="barra" class="flex flex-col gap-6" @click.capture="aoClicar">
    <UContentSearchButton :collapsed="false" />

    <div v-if="carregando" class="flex flex-col gap-2" role="status" :aria-label="t.estados.carregando">
      <div
        v-for="n in 10"
        :key="n"
        class="h-7 rounded bg-elevated"
        :style="{ animation: 'pulso-suave 1.4s ease-in-out infinite', animationDelay: `${n * 70}ms`, width: `${50 + ((n * 17) % 45)}%` }"
      />
    </div>

    <div v-else-if="erro" class="flex flex-col items-start gap-2 rounded-lg border border-error/30 bg-error/5 p-3">
      <p class="flex items-center gap-1.5 text-sm font-semibold text-highlighted">
        <UIcon name="i-lucide-triangle-alert" class="size-4 text-error" />
        {{ t.estados.erroTitulo }}
      </p>
      <p class="text-sm text-muted">{{ t.estados.erroTexto }}</p>
      <UButton :label="t.estados.erroAcao" size="xs" color="neutral" variant="outline" icon="i-lucide-rotate-ccw" class="cursor-pointer" @click="emit('recarregar')" />
    </div>

    <UContentNavigation
      v-else
      data-barra
      :aria-label="t.casca.menuDaDoc"
      :navigation="itens"
      :type="menu === 'hoje' ? 'single' : 'multiple'"
      highlight
      highlight-color="primary"
      :level="0"
      :ui="ui"
    >
      <template #link-title="{ link }">
        <span :title="link.title || ''">{{ link.title }}</span>
      </template>
    </UContentNavigation>
  </div>
</template>

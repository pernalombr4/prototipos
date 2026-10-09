<script setup lang="ts">
/**
 * A caixa do BENI: abre logo abaixo do trecho (ou da linha do cursor). PROPOSTA.
 *
 * Uma caixa só para falar com a IA, no padrão de Notion, Tiptap e BlockNote
 * (PESQUISA-RODADA-2, D): o pedido livre no topo e as ações embaixo. Digitar
 * filtra as ações e põe "Seu pedido" em 1º lugar, para o Enter mandar o
 * texto livre. A ordem dos grupos: pedidos salvos, ações do trecho (ou do
 * campo), agentes.
 *
 * O rodapé diz o que a IA lê e traz os 2 seletores pedidos em 09/10/2026:
 * Agente (o BENI ou um agente do workspace) e Modelo (com o agente, o modelo
 * do perfil vem marcado e a pessoa pode trocar só neste pedido).
 *
 * A caixa só junta o pedido: quem gera e mostra a proposta é o campo.
 */
import type { CommandPaletteGroup, CommandPaletteItem } from '@nuxt/ui'
import type { Textos } from './textos'
import type { Acao } from './simulador'
import type { AgenteDoCampo, PedidoSalvo } from './mocks'
import { agentesVisiveis, camposDeContexto } from './mocks'
import { idiomas, tons } from './simulador'
import AvatarDoAgente from './_AvatarDoAgente.vue'
import SeletorDeAgente from './_SeletorDeAgente.vue'
import SeletorDeModelo from './_SeletorDeModelo.vue'

export interface PedidoDaCaixa { acao: Acao, parametro?: string, prompt?: string, rotulo: string }

const props = defineProps<{
  t: Textos
  comSelecao: boolean
  campoVazio: boolean
  rotuloDoCampo: string
  pedidosSalvos: PedidoSalvo[]
}>()

const emit = defineEmits<{
  pedir: [pedido: PedidoDaCaixa]
  fechar: []
}>()

const agente = defineModel<AgenteDoCampo | null>('agente', { default: null })
const modelo = defineModel<string>('modelo', { required: true })
const usarCampos = defineModel<boolean>('usarCampos', { default: true })

const busca = ref('')
const todosOsAgentes = ref(false)
const raiz = useTemplateRef<HTMLElement>('raiz')
const tb = computed(() => props.t.beni)

function acao(a: Acao, rotulo: string, icone: string, extra: Partial<CommandPaletteItem> = {}): CommandPaletteItem {
  return { label: rotulo, icon: icone, onSelect: () => emit('pedir', { acao: a, rotulo }), ...extra }
}

const grupos = computed<CommandPaletteGroup[]>(() => {
  const g: CommandPaletteGroup[] = []
  const q = busca.value.trim()

  if (q) {
    g.push({
      id: 'pedido',
      ignoreFilter: true,
      items: [{ label: q, icon: 'i-lucide-send-horizontal', suffix: tb.value.seuPedido, onSelect: () => emit('pedir', { acao: 'pedir', prompt: q, rotulo: q }) }],
    })
  }

  if (props.pedidosSalvos.length) {
    g.push({
      id: 'salvos',
      label: tb.value.grupoSalvos,
      items: props.pedidosSalvos.map(p => ({ label: p.nome, icon: 'i-lucide-bookmark', onSelect: () => emit('pedir', { acao: 'pedir', prompt: p.prompt, rotulo: p.nome }) })),
    })
  }

  if (props.comSelecao) {
    g.push({
      id: 'editar',
      label: tb.value.grupoEditar,
      items: [
        acao('melhorar', tb.value.melhorar, 'i-lucide-wand-sparkles'),
        acao('corrigir', tb.value.corrigir, 'i-lucide-spell-check'),
        acao('encurtar', tb.value.encurtar, 'i-lucide-fold-vertical'),
        acao('expandir', tb.value.expandir, 'i-lucide-unfold-vertical'),
        acao('simplificar', tb.value.simplificar, 'i-lucide-feather'),
        acao('explicar', tb.value.explicar, 'i-lucide-circle-help'),
        acao('lista', tb.value.lista, 'i-lucide-list'),
        {
          label: tb.value.tom,
          icon: 'i-lucide-mic-vocal',
          placeholder: tb.value.tom,
          children: tons.map(k => ({ label: tb.value.tons[k]!, onSelect: () => emit('pedir', { acao: 'tom', parametro: k, rotulo: tb.value.paraTom(tb.value.tons[k]!) }) })),
        },
        {
          label: tb.value.traduzir,
          icon: 'i-lucide-languages',
          placeholder: tb.value.traduzir,
          children: idiomas.map(k => ({ label: tb.value.idiomas[k]!, onSelect: () => emit('pedir', { acao: 'traduzir', parametro: k, rotulo: tb.value.paraIdioma(tb.value.idiomas[k]!) }) })),
        },
        acao('resumir', tb.value.resumirSelecao, 'i-lucide-text-quote'),
      ],
    })
  }
  else {
    g.push({
      id: 'escrever',
      label: tb.value.grupoEscrever,
      items: [
        acao('continuar', tb.value.continuar, 'i-lucide-pen-line', { description: tb.value.continuarDescricao, disabled: props.campoVazio }),
        acao('resumir', tb.value.resumir, 'i-lucide-text-quote', { description: tb.value.resumirDescricao, disabled: props.campoVazio }),
        acao('pendencias', tb.value.pendencias, 'i-lucide-list-checks', { description: tb.value.pendenciasDescricao, disabled: props.campoVazio }),
        acao('rascunhar', tb.value.rascunhar, 'i-lucide-file-pen-line', { description: tb.value.rascunharDescricao }),
      ],
    })
  }

  // Até 5 agentes direto; "Ver todos" abre o resto (Confluence, "Browse agents").
  const visiveis = todosOsAgentes.value ? agentesVisiveis : agentesVisiveis.slice(0, 5)
  g.push({
    id: 'agentes',
    label: tb.value.grupoAgentes,
    items: [
      ...visiveis.map(a => ({
        label: a.name,
        suffix: props.t.agente.tipos[a.type ?? 'chat'],
        slot: 'agente' as const,
        slug: a.slug,
        onSelect: (e: Event) => { e.preventDefault(); agente.value = a; busca.value = '' },
      })),
      ...(!todosOsAgentes.value && agentesVisiveis.length > 5
        ? [{ label: tb.value.verTodos(agentesVisiveis.length), icon: 'i-lucide-chevrons-down', onSelect: (e: Event) => { e.preventDefault(); todosOsAgentes.value = true } }]
        : []),
    ],
  })
  return g
})

const placeholder = computed(() => agente.value
  ? tb.value.placeholderAgente(agente.value.name)
  : props.comSelecao ? tb.value.placeholderSelecao : tb.value.placeholderPedido)

/* Clique fora fecha: nada foi gerado ainda, não há o que perder. */
function aoClicarFora(e: PointerEvent) {
  const alvo = e.target as HTMLElement
  if (raiz.value?.contains(alvo)) return
  if (alvo?.closest('[data-reka-popper-content-wrapper], [role=dialog], [role=listbox]')) return
  emit('fechar')
}
onMounted(() => document.addEventListener('pointerdown', aoClicarFora, true))
onBeforeUnmount(() => document.removeEventListener('pointerdown', aoClicarFora, true))
</script>

<template>
  <div
    ref="raiz"
    role="dialog"
    :aria-label="tb.caixa"
    class="overflow-hidden rounded-xl border border-default bg-default shadow-xl ring-1 ring-primary/15"
    @keydown.esc.stop.prevent="emit('fechar')"
  >
    <UCommandPalette
      v-model:search-term="busca"
      :groups="grupos"
      :placeholder="placeholder"
      icon="i-lucide-sparkles"
      size="sm"
      :fuse="{ resultLimit: 14 }"
      :input="{ ui: { leadingIcon: 'text-primary' } }"
      :ui="{ root: 'max-h-96', label: 'text-[11px] text-dimmed', content: 'max-h-72' }"
    >
      <template #agente-leading="{ item }">
        <AvatarDoAgente :agente="agentesVisiveis.find(a => a.slug === item.slug) ?? null" tamanho="xs" />
      </template>
      <template #agente-trailing="{ item }">
        <UIcon v-if="agente?.slug === item.slug" name="i-lucide-check" class="size-4 text-primary" />
      </template>
      <template #empty>
        <span class="text-sm text-muted">{{ tb.pedirDescricao }}</span>
      </template>
    </UCommandPalette>

    <!-- RODAPÉ: o que a IA lê, Agente, Modelo, aviso -->
    <div class="flex flex-wrap items-center gap-1 border-t border-default bg-elevated/50 px-2 py-1.5 text-xs text-muted">
      <UPopover :content="{ align: 'start', side: 'top', sideOffset: 6 }">
        <UButton color="neutral" variant="ghost" size="xs" class="gap-1 px-1.5 text-xs text-muted">
          <UIcon name="i-lucide-file-search" class="size-3.5" />
          {{ comSelecao ? tb.contextoTrecho : tb.contextoCampo }}
          <span v-if="usarCampos" class="text-dimmed">{{ tb.maisCampos(camposDeContexto.length) }}</span>
        </UButton>
        <template #content>
          <div class="w-72 p-3">
            <p class="mb-2 text-xs font-semibold uppercase tracking-wider text-muted">{{ tb.contextoTitulo }}</p>
            <ul class="mb-3 flex flex-col gap-1 text-sm">
              <li class="flex items-center gap-2 text-highlighted">
                <UIcon name="i-lucide-text-cursor-input" class="size-4 text-primary" />{{ comSelecao ? tb.contextoTrecho : tb.contextoCampo }} ({{ rotuloDoCampo }})
              </li>
              <li v-for="c in camposDeContexto" :key="c.chave" class="flex items-center gap-2 transition-opacity" :class="usarCampos ? 'text-default' : 'text-dimmed line-through'">
                <UIcon name="i-lucide-square-dot" class="size-4 text-muted" />{{ c.rotulo }}
              </li>
            </ul>
            <USwitch v-model="usarCampos" :label="tb.usarCampos" size="sm" />
          </div>
        </template>
      </UPopover>

      <span class="h-4 w-px bg-accented" aria-hidden="true" />
      <SeletorDeAgente v-model="agente" :t="t" />
      <SeletorDeModelo v-model="modelo" :t="t" :do-agente="agente?.model ?? null" />

      <span class="ms-auto flex items-center gap-2">
        <UTooltip :text="tb.aviso">
          <UIcon name="i-lucide-info" class="size-3.5" :aria-label="tb.aviso" />
        </UTooltip>
        <span class="flex items-center gap-1"><UKbd value="Esc" size="sm" /> {{ tb.fechar }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import MenuDeAjuda from './_MenuDeAjuda.vue'
import { useMenuDoWorkspace } from './estado'
import { useAcoesDoMenu } from './acoes'
import type { NoDoMenu, Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * A BARRA ÚNICA RECOLHIDA (rodada 14).
 *
 * "falta voce prototipar o comportamento do menu fechado e aberto
 * (minimizado/expandido)" (Mikaela).
 *
 * Recolhida, a barra vira uma coluna de ícones, um por linha de primeiro
 * nível, na MESMA ordem da barra aberta: quem arrumou o menu reconhece o
 * arranjo pela posição, mesmo sem os nomes. É o comportamento do Linear, do
 * Notion e do Jira novo. Três regras:
 *
 * 1. **Destino abre direto.** Um clique, como na barra aberta.
 * 2. **Seção abre de lado.** O ícone de uma seção abre os itens dela num menu
 *    à direita, e não expande a barra. Expandir para escolher e recolher de
 *    novo seria pedir dois cliques a mais a quem escolheu ter menos barra.
 * 3. **Nada se perde.** Nome no tooltip, contador vira bolinha, botão direito
 *    igual ao da barra aberta. Item ativo continua marcado, e a seção que tem
 *    o item ativo dentro também.
 *
 * O que NÃO entra: a barra abrir sozinha quando o mouse passa na borda. O
 * ClickUp faz isso e é o pedido mais votado contra a navegação dele ("Personal
 * Setting to Disable Sidebar Expand on Hover"): quem recolheu quer a tela, e o
 * mouse passa na borda o tempo todo a caminho de outra coisa.
 */
const props = defineProps<{
  t: TextosDaTela
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  podeConfigurar: boolean
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  configuracoes: []
  ajuda: [rotulo: string]
  expandir: []
  novaTela: [secaoId: string]
  configurarCategoria: [c: Categoria]
}>()

const menu = useMenuDoWorkspace()

function rotuloDe(no: NoDoMenu) {
  if (no.rotulo) return no.rotulo
  const mapa: Record<string, string> = {
    inicio: props.t.inicio,
    inbox: props.t.inbox,
    chatIa: props.t.chatIa,
    tarefas: props.t.tarefas,
    agenda: props.t.agenda,
    spaceflows: props.t.spaceflows,
    documentos: props.t.documentos,
    categorias: props.t.categorias,
    auditoria: props.t.grupos.auditoria,
    logsAuditoria: props.t.itens['logs-auditoria'],
    logsRequisicao: props.t.itens['logs-requisicao'],
  }
  return mapa[no.chave ?? ''] ?? (no.chave ?? '')
}

function contadorDe(no: NoDoMenu) {
  if (no.chave === 'inbox') return menu.naoLidas.value || 0
  if (no.chave === 'tarefas') return 3
  return 0
}

/** Recolhida, "expandir seção" pelo botão direito expande a barra inteira. */
const acoes = useAcoesDoMenu({
  t: () => props.t,
  podeConfigurar: () => props.podeConfigurar,
  rotuloDe,
  abrirDestino: id => emit('destino', id),
  abrirCategoria: c => emit('categoria', c),
  alternarFixar: id => emit('alternarFixar', id),
  configurarCategoria: c => emit('configurarCategoria', c),
  novaTela: id => emit('novaTela', id),
  secaoAberta: () => false,
  alternarSecao: () => emit('expandir'),
})

const nos = computed(() => menu.arvoreDaBarra.value)
const idsDaRaiz = computed(() => nos.value.map(n => n.id))

function temUmaSo(no: NoDoMenu) {
  return (no.filhos?.length ?? 0) === 1
}

/** A seção acende quando o que está aberto mora dentro dela. */
function ativo(no: NoDoMenu) {
  if (no.tipo === 'destino') return props.destinoAtivo === no.id
  if (no.tipo === 'secao-nativa') return props.categoriaAtivaId !== null
  return (no.filhos ?? []).some(f => f.id === props.destinoAtivo)
}

/** O que o ícone de uma seção abre, de lado. */
function itensDaSecao(no: NoDoMenu) {
  return [
    [{ type: 'label' as const, label: rotuloDe(no) }],
    (no.filhos ?? []).map(f => ({
      label: rotuloDe(f),
      icon: f.icone,
      // O item aberto ganha o visto no fim: cor sozinha não diz estado.
      trailingIcon: props.destinoAtivo === f.id ? 'i-lucide-check' : undefined,
      onSelect: () => emit('destino', f.id),
    })),
  ]
}

function itemDaCategoria(c: Categoria) {
  return {
    label: c.name,
    icon: c.icon ?? 'i-lucide-folder',
    trailingIcon: props.categoriaAtivaId === c.id ? 'i-lucide-check' : undefined,
    onSelect: () => emit('categoria', c),
  }
}

/** Favoritos e Categorias saem juntos do mesmo ícone, como na barra aberta. */
const itensDeCategorias = computed(() => {
  const grupos = []
  if (props.favoritas.length) {
    grupos.push([{ type: 'label' as const, label: props.t.favoritos }, ...props.favoritas.map(itemDaCategoria)])
  }
  grupos.push([{ type: 'label' as const, label: props.t.categorias }, ...props.recorte.map(itemDaCategoria)])
  grupos.push([{ label: props.t.verTodas(props.totalDeCategorias), icon: 'i-lucide-layout-grid', onSelect: () => emit('verTodas') }])
  return grupos
})

/** O botão de ícone, com as mesmas três aparências em todo lugar desta coluna. */
function classeDoIcone(acesa: boolean) {
  return [
    'relative flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
    acesa ? 'bg-primary/10 text-primary' : 'text-toned hover:bg-elevated hover:text-highlighted',
  ]
}
</script>

<template>
  <div class="flex h-full flex-col items-center">
    <div class="shrink-0 pb-1 pt-1.5">
      <UTooltip :text="props.t.expandirMenu" :kbds="['meta', '\\']" :content="{ side: 'right' }">
        <UButton
          icon="i-lucide-panel-left-open"
          size="sm"
          color="neutral"
          variant="ghost"
          :aria-label="props.t.expandirMenu"
          aria-expanded="false"
          aria-keyshortcuts="Control+Backslash"
          @click="emit('expandir')"
        />
      </UTooltip>
    </div>

    <nav class="flex min-h-0 w-full flex-1 flex-col items-center gap-1 overflow-y-auto py-1" :aria-label="props.t.navegacao">
      <template v-for="(no, i) in nos" :key="no.id">
        <!-- destino: um clique, como aberta -->
        <UContextMenu v-if="no.tipo === 'destino'" :items="acoes.daLinha(no, idsDaRaiz)">
          <UTooltip :text="contadorDe(no) ? `${rotuloDe(no)} (${contadorDe(no)})` : rotuloDe(no)" :content="{ side: 'right' }">
            <button
              type="button"
              :class="classeDoIcone(ativo(no))"
              class="animate-[entrada_0.2s_ease-out_both]"
              :style="{ animationDelay: `${i * 20}ms` }"
              :aria-label="contadorDe(no) ? `${rotuloDe(no)}, ${contadorDe(no)}` : rotuloDe(no)"
              :aria-current="ativo(no) ? 'page' : undefined"
              @click="emit('destino', no.id)"
            >
              <UChip :show="contadorDe(no) > 0" color="warning" size="md" inset>
                <UIcon :name="no.icone" class="size-5" />
              </UChip>
            </button>
          </UTooltip>
        </UContextMenu>

        <!-- favoritos e categorias: um ícone que abre os dois de lado -->
        <UContextMenu v-else-if="no.tipo === 'secao-nativa'" :items="acoes.daSecao(no, idsDaRaiz)">
          <UDropdownMenu :items="itensDeCategorias" :content="{ side: 'right', align: 'start' }" :ui="{ content: 'min-w-56' }">
            <UTooltip :text="rotuloDe(no)" :content="{ side: 'right' }">
              <button
                type="button"
                :class="classeDoIcone(ativo(no))"
                class="animate-[entrada_0.2s_ease-out_both]"
                :style="{ animationDelay: `${i * 20}ms` }"
                :aria-label="rotuloDe(no)"
              >
                <UIcon :name="no.icone" class="size-5" />
              </button>
            </UTooltip>
          </UDropdownMenu>
        </UContextMenu>

        <!-- seção de uma tela só: abre direto, como a linha simples da barra aberta -->
        <UContextMenu
          v-else-if="temUmaSo(no)"
          :items="acoes.daLinha(no, idsDaRaiz, { abrir: () => emit('destino', no.filhos![0]!.id) })"
        >
          <UTooltip :text="rotuloDe(no)" :content="{ side: 'right' }">
            <button
              type="button"
              :class="classeDoIcone(ativo(no))"
              class="animate-[entrada_0.2s_ease-out_both]"
              :style="{ animationDelay: `${i * 20}ms` }"
              :aria-label="rotuloDe(no)"
              :aria-current="ativo(no) ? 'page' : undefined"
              @click="emit('destino', no.filhos![0]!.id)"
            >
              <UIcon :name="no.icone" class="size-5" />
            </button>
          </UTooltip>
        </UContextMenu>

        <!-- seção: os itens abrem de lado -->
        <UContextMenu v-else :items="acoes.daSecao(no, idsDaRaiz)">
          <UDropdownMenu :items="itensDaSecao(no)" :content="{ side: 'right', align: 'start' }" :ui="{ content: 'min-w-56' }">
            <UTooltip :text="rotuloDe(no)" :content="{ side: 'right' }">
              <button
                type="button"
                :class="classeDoIcone(ativo(no))"
                class="animate-[entrada_0.2s_ease-out_both]"
                :style="{ animationDelay: `${i * 20}ms` }"
                :aria-label="rotuloDe(no)"
              >
                <UIcon :name="no.icone" class="size-5" />
              </button>
            </UTooltip>
          </UDropdownMenu>
        </UContextMenu>
      </template>
    </nav>

    <!-- rodapé: Configurações e Ajuda, nos mesmos lugares da barra aberta -->
    <div class="flex w-full shrink-0 flex-col items-center gap-1 border-t border-default py-2">
      <!--
        Recolhido não esconde o que falta salvar (rodada 14): o cartão de salvar
        mora na barra aberta, então aqui fica o sinal, e o clique abre a barra.
      -->
      <UTooltip v-if="menu.alterado.value" :text="props.t.naoSalvoTitulo" :content="{ side: 'right' }">
        <button
          type="button"
          class="relative flex size-9 shrink-0 animate-[entrada_0.2s_ease-out_both] items-center justify-center rounded-lg text-highlighted ring-1 ring-warning/50 transition-colors hover:bg-elevated focus-visible:outline-2 focus-visible:outline-primary"
          :aria-label="props.t.naoSalvoTitulo"
          @click="emit('expandir')"
        >
          <UIcon name="i-lucide-save" class="size-5" />
          <span class="absolute right-1 top-1 size-2 rounded-full bg-warning" aria-hidden="true" />
        </button>
      </UTooltip>
      <UTooltip :text="props.podeConfigurar ? props.t.configuracoes : props.t.semPermissaoTitulo" :content="{ side: 'right' }">
        <button
          type="button"
          :class="classeDoIcone(false)"
          :aria-label="props.t.configuracoes"
          :aria-disabled="!props.podeConfigurar || undefined"
          @click="props.podeConfigurar && emit('configuracoes')"
        >
          <UIcon :name="props.podeConfigurar ? 'i-lucide-settings' : 'i-lucide-lock'" class="size-5" />
        </button>
      </UTooltip>
      <MenuDeAjuda :t="props.t" @escolher="r => emit('ajuda', r)" />
    </div>
  </div>
</template>

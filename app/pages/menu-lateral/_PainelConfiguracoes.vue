<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import { gruposDeConfiguracao, workspace } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O painel de configurações.
 *
 * Ele TROCA o painel de trabalho, não se soma a ele. É o padrão 1 da pesquisa, e a
 * mecânica é a do ClickUp (Home Sidebar e Spaces Sidebar) e a do Linear (páginas de
 * configuração próprias).
 *
 * Regra 16 e regra 20, respeitadas: "Configurações" continua sendo um item do menu
 * lateral, no mesmo lugar. O que mudou foi o que acontece ao clicar: em vez de
 * despejar 19 linhas no meio do trabalho, abre a área de administração com a
 * navegação dela. O endereço é o mesmo; o que sai de lá são os filhos.
 *
 * Um grupo aberto por vez: com oito grupos, abrir todos recriaria o problema.
 */
const props = defineProps<{
  t: TextosDaTela
  itemAtivo: string
}>()

const emit = defineEmits<{
  voltar: []
  item: [id: string, rotulo: string]
}>()

const grupoAberto = ref<string>('estrutura')
const busca = ref('')

function alternar(id: string) {
  grupoAberto.value = grupoAberto.value === id ? '' : id
}

/**
 * Busca dentro das configurações: filtra de verdade, sobre os 23 itens em memória.
 * Com busca ativa, os grupos que têm resultado abrem sozinhos.
 */
const gruposVisiveis = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  if (!termo) return gruposDeConfiguracao.map(g => ({ ...g, forcado: false }))

  return gruposDeConfiguracao
    .map(g => ({
      ...g,
      itens: g.itens.filter(i => (props.t.itens[i.id] ?? '').toLowerCase().includes(termo)),
      forcado: true,
    }))
    .filter(g => g.itens.length > 0)
})

const nenhumResultado = computed(() => busca.value.trim() !== '' && gruposVisiveis.value.length === 0)
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- ============ topo: a volta, sempre visível ============ -->
    <div class="flex shrink-0 flex-col gap-2 p-3">
      <UButton
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :aria-label="props.t.voltarDica"
        @click="emit('voltar')"
      >
        <UIcon name="i-lucide-arrow-left" class="size-4 shrink-0 text-muted" />
        <span class="min-w-0 flex-1 text-left">
          <span class="block truncate text-xs font-normal text-muted">{{ props.t.voltar }}</span>
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
        </span>
      </UButton>

      <div class="flex items-center gap-2 px-1 pt-1">
        <UIcon name="i-lucide-settings" class="size-4 shrink-0 text-toned" />
        <h2 class="min-w-0 flex-1 truncate text-sm font-bold uppercase tracking-wider text-highlighted">
          {{ props.t.configuracoes }}
        </h2>
      </div>

      <UInput
        v-model="busca"
        icon="i-lucide-search"
        size="sm"
        :placeholder="props.t.buscar"
        :aria-label="props.t.buscar"
      >
        <template v-if="busca" #trailing>
          <UButton
            icon="i-lucide-x"
            size="xs"
            color="neutral"
            variant="link"
            :aria-label="props.t.todasFechar"
            @click="busca = ''"
          />
        </template>
      </UInput>
    </div>

    <!-- ============ os oito grupos ============ -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-3 pb-3" :aria-label="props.t.configuracoes">
      <SecaoDeMenu
        v-for="g in gruposVisiveis"
        :key="g.id"
        :rotulo="props.t.grupos[g.id] ?? g.id"
        :aberta="g.forcado || grupoAberto === g.id"
        :texto-recolher="props.t.recolherSecao(props.t.grupos[g.id] ?? g.id)"
        :texto-expandir="props.t.expandirSecao(props.t.grupos[g.id] ?? g.id)"
        @alternar="alternar(g.id)"
      >
        <LinhaDeMenu
          v-for="(item, i) in g.itens"
          :key="item.id"
          :icone="item.icone"
          :rotulo="props.t.itens[item.id] ?? item.id"
          :nivel="2"
          :ativo="props.itemAtivo === item.id"
          :atraso="i * 22"
          @selecionar="emit('item', item.id, props.t.itens[item.id] ?? item.id)"
        />
      </SecaoDeMenu>

      <UEmpty
        v-if="nenhumResultado"
        icon="i-lucide-search-x"
        :title="props.t.todasNenhuma(busca)"
        :description="props.t.todasNenhumaDica"
        class="animate-[entrada_0.25s_ease-out_both]"
      />
    </nav>
  </div>
</template>

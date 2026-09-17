<script setup lang="ts">
import LinhaDeMenu from './_LinhaDeMenu.vue'
import SecaoDeMenu from './_SecaoDeMenu.vue'
import { destinosDeTrabalho, secoesPersonalizadas, workspace, usuaria, type Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O painel de trabalho: o menu do dia a dia.
 *
 * Dois níveis e nada mais. Nível 1 é destino solto ou nome de seção; nível 2 é item
 * dentro de seção. O terceiro nível de hoje (formulário dentro de categoria) virou
 * aba na tela da categoria.
 *
 * A ordem dos destinos nativos é a MESMA de hoje (Início, Spaceflows, Categorias,
 * Tarefas, Agenda). Regra 16: o peso pode mudar, o endereço não.
 */
const props = defineProps<{
  t: TextosDaTela
  favoritas: Categoria[]
  recorte: Categoria[]
  totalDeCategorias: number
  destinoAtivo: string
  categoriaAtivaId: number | null
  estado: 'normal' | 'volume' | 'vazio' | 'carregando' | 'erro'
  podeConfigurar: boolean
  ordem: 'uso' | 'alfabetica' | 'recentes'
  itensDeCriar: { label: string, icon: string, onSelect: () => void }[][]
}>()

const emit = defineEmits<{
  destino: [id: string]
  categoria: [c: Categoria]
  alternarFixar: [id: number]
  verTodas: []
  configuracoes: []
  busca: []
  criar: []
  ordem: [valor: 'uso' | 'alfabetica' | 'recentes']
  ajuda: []
}>()

/** Estado de aberto/fechado por seção. Favoritos e Categorias abrem por padrão. */
const abertas = ref<Record<string, boolean>>({
  favoritos: true,
  categorias: true,
  ...Object.fromEntries(secoesPersonalizadas.map(s => [s.id, false])),
})

function alternar(id: string) {
  abertas.value[id] = !abertas.value[id]
}

const opcoesDeOrdem = computed(() => [[
  { label: props.t.ordemMaisUsadas, icon: 'i-lucide-flame', onSelect: () => emit('ordem', 'uso') },
  { label: props.t.ordemAlfabetica, icon: 'i-lucide-arrow-down-a-z', onSelect: () => emit('ordem', 'alfabetica') },
  { label: props.t.ordemRecentes, icon: 'i-lucide-clock', onSelect: () => emit('ordem', 'recentes') },
]])
</script>

<template>
  <div class="flex h-full flex-col">
    <!-- ============ topo fixo: workspace, busca, criar ============ -->
    <div class="flex shrink-0 flex-col gap-2 p-2">
      <UButton
        color="neutral"
        variant="outline"
        class="w-full justify-start"
        :aria-label="props.t.trocarWorkspace"
      >
        <span class="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary text-xs font-bold text-inverted">
          {{ workspace.inicial }}
        </span>
        <span class="min-w-0 flex-1 text-left">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
          <span class="block truncate text-xs font-normal text-muted">{{ workspace.referencia }}</span>
        </span>
        <UIcon name="i-lucide-chevrons-up-down" class="size-4 shrink-0 text-muted" />
      </UButton>

      <!--
        Busca de primeira classe: padrão 6, os oito produtos pesquisados têm.
        Busca e criar dividem a linha para devolver altura à navegação, que é o
        que está sendo medido aqui. É o arranjo do Linear e do Attio.
      -->
      <div class="flex items-center gap-2">
        <UButton
          color="neutral"
          variant="outline"
          class="min-w-0 flex-1 justify-start"
          @click="emit('busca')"
        >
          <UIcon name="i-lucide-search" class="size-4 shrink-0 text-muted" />
          <span class="min-w-0 flex-1 truncate text-left text-sm font-normal text-muted">{{ props.t.buscar }}</span>
          <UKbd value="ctrl" size="sm" />
          <UKbd value="K" size="sm" />
        </UButton>

        <!-- O "+" abre menu de verdade: item, tarefa, categoria, seção de menu. -->
        <UDropdownMenu :items="props.itensDeCriar" :content="{ align: 'end' }">
          <UTooltip :text="props.t.criar">
            <UButton
              icon="i-lucide-plus"
              color="primary"
              :aria-label="props.t.criar"
            />
          </UTooltip>
        </UDropdownMenu>
      </div>
    </div>

    <!-- ============ navegação ============ -->
    <nav class="min-h-0 flex-1 overflow-y-auto px-2" :aria-label="props.t.inicio">
      <!-- carregando -->
      <div v-if="props.estado === 'carregando'" class="space-y-2 pt-1">
        <USkeleton v-for="n in 7" :key="n" class="h-7" :class="n % 3 === 0 ? 'w-3/4' : 'w-full'" />
      </div>

      <!-- erro -->
      <div v-else-if="props.estado === 'erro'" class="pt-2">
        <UAlert
          icon="i-lucide-unplug"
          color="error"
          variant="subtle"
          :title="props.t.erroTitulo"
          :description="props.t.erroDescricao"
          :actions="[{ label: props.t.erroAcao, color: 'neutral', variant: 'outline' }]"
          :ui="{ title: 'text-sm', description: 'text-xs' }"
        />
      </div>

      <template v-else>
        <!-- destinos soltos, na ordem de hoje -->
        <div class="space-y-0.5">
          <LinhaDeMenu
            v-for="(d, i) in destinosDeTrabalho"
            :key="d.id"
            :icone="d.icone"
            :rotulo="props.t[d.rotulo as 'inicio' | 'spaceflows' | 'tarefas' | 'agenda']"
            :contador="d.contador"
            :ativo="props.destinoAtivo === d.id"
            :atraso="i * 25"
            @selecionar="emit('destino', d.id)"
          />
        </div>

        <!-- Favoritos: nasce do uso, some quando esvazia. Padrão 4. -->
        <SecaoDeMenu
          v-if="props.favoritas.length"
          :rotulo="props.t.favoritos"
          :aberta="abertas.favoritos"
          :texto-recolher="props.t.recolherSecao(props.t.favoritos)"
          :texto-expandir="props.t.expandirSecao(props.t.favoritos)"
          @alternar="alternar('favoritos')"
        >
          <LinhaDeMenu
            v-for="(c, i) in props.favoritas"
            :key="c.id"
            :icone="c.icon ?? 'i-lucide-folder'"
            :rotulo="c.name"
            :nivel="2"
            com-estrela
            :fixada="true"
            :rotulo-fixar="props.t.fixar"
            :rotulo-desafixar="props.t.desafixar"
            :ativo="props.categoriaAtivaId === c.id"
            :atraso="100 + i * 25"
            @selecionar="emit('categoria', c)"
            @alternar-estrela="emit('alternarFixar', c.id)"
          />
        </SecaoDeMenu>

        <!-- Categorias: a seção que cresce. Recorte mais "ver todas". Padrão 3. -->
        <SecaoDeMenu
          :rotulo="props.t.categorias"
          :aberta="abertas.categorias"
          :contador="props.totalDeCategorias || undefined"
          :texto-recolher="props.t.recolherSecao(props.t.categorias)"
          :texto-expandir="props.t.expandirSecao(props.t.categorias)"
          @alternar="alternar('categorias')"
        >
          <template #acoes>
            <!-- Ordenação da seção, como no Attio. -->
            <UDropdownMenu :items="opcoesDeOrdem">
              <UButton
                icon="i-lucide-settings-2"
                size="xs"
                color="neutral"
                variant="ghost"
                :aria-label="props.t.ordenarPor"
              />
            </UDropdownMenu>
          </template>

          <template v-if="props.estado === 'vazio'">
            <!--
              Estado vazio que ENSINA. A fricção S1-F4 diz que a categoria criada
              some porque "Menu automático" nasce desligado: quem chega aqui sem
              nada precisa saber o que é categoria e como fazer uma aparecer.
            -->
            <div class="mx-1 mt-1 rounded-lg border border-dashed border-default p-3">
              <p class="text-sm font-medium text-highlighted">{{ props.t.vazioTitulo }}</p>
              <p class="mt-1 text-xs leading-relaxed text-muted">{{ props.t.vazioDescricao }}</p>
              <UButton
                :label="props.t.vazioAcao"
                icon="i-lucide-plus"
                size="xs"
                color="primary"
                variant="soft"
                class="mt-2"
                @click="emit('criar')"
              />
            </div>
          </template>

          <template v-else>
            <LinhaDeMenu
              v-for="(c, i) in props.recorte"
              :key="c.id"
              :icone="c.icon ?? 'i-lucide-folder'"
              :rotulo="c.name"
              :nivel="2"
              com-estrela
              :fixada="c.favorita"
              :rotulo-fixar="props.t.fixar"
              :rotulo-desafixar="props.t.desafixar"
              :ativo="props.categoriaAtivaId === c.id"
              :atraso="180 + i * 25"
              @selecionar="emit('categoria', c)"
              @alternar-estrela="emit('alternarFixar', c.id)"
            />

            <button
              type="button"
              class="mt-0.5 flex w-full items-center gap-2.5 rounded-md py-1.5 pl-8 pr-2.5 text-sm font-medium text-highlighted transition-colors hover:bg-primary/10"
              @click="emit('verTodas')"
            >
              <!-- Ícone na cor de marca, texto não: `text-primary` em 14px não passa
                   em AA no tema claro (medido em 3,39:1). -->
              <UIcon name="i-lucide-layout-grid" class="size-4 shrink-0 text-primary" />
              <span class="min-w-0 flex-1 truncate text-left">
                {{ props.t.verTodas(props.totalDeCategorias) }}
              </span>
            </button>
          </template>
        </SecaoDeMenu>

        <!-- Seções do workspace: mesma gramática das nativas. -->
        <SecaoDeMenu
          v-for="s in secoesPersonalizadas"
          :key="s.id"
          :rotulo="s.rotulo"
          :aberta="abertas[s.id] ?? false"
          :texto-recolher="props.t.recolherSecao(s.rotulo)"
          :texto-expandir="props.t.expandirSecao(s.rotulo)"
          @alternar="alternar(s.id)"
        >
          <LinhaDeMenu
            v-for="(item, i) in s.itens"
            :key="item.id"
            :icone="item.icone"
            :rotulo="item.rotulo"
            :nivel="2"
            :ativo="props.destinoAtivo === item.id"
            :atraso="i * 25"
            @selecionar="emit('destino', item.id)"
          />
        </SecaoDeMenu>
      </template>
    </nav>

    <!-- ============ rodapé: configurações, ajuda, pessoa ============ -->
    <div class="shrink-0 border-t border-default p-2">
      <div class="space-y-0.5">
        <UTooltip :text="props.podeConfigurar ? props.t.configuracoesDica : props.t.semPermissaoTitulo">
          <button
            type="button"
            class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors"
            :class="props.podeConfigurar
              ? 'text-default hover:bg-elevated'
              : 'cursor-not-allowed text-muted'"
            :disabled="!props.podeConfigurar"
            @click="emit('configuracoes')"
          >
            <UIcon name="i-lucide-settings" class="size-4 shrink-0 text-toned" />
            <span class="min-w-0 flex-1 truncate text-left">{{ props.t.configuracoes }}</span>
            <UIcon
              :name="props.podeConfigurar ? 'i-lucide-chevron-right' : 'i-lucide-lock'"
              class="size-3.5 shrink-0 text-muted"
            />
          </button>
        </UTooltip>

        <button
          type="button"
          class="flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm text-default transition-colors hover:bg-elevated"
          @click="emit('ajuda')"
        >
          <UIcon name="i-lucide-circle-question-mark" class="size-4 shrink-0 text-toned" />
          <span class="min-w-0 flex-1 truncate text-left">{{ props.t.ajuda }}</span>
        </button>
      </div>

      <div class="mt-1 flex items-center gap-2.5 px-1.5 pt-1">
        <UAvatar :alt="usuaria.nome" size="xs" />
        <span class="min-w-0 flex-1">
          <span class="block truncate text-sm font-medium text-default">{{ usuaria.nome }}</span>
          <span class="block truncate text-xs text-muted">{{ usuaria.cargo }}</span>
        </span>
      </div>
    </div>
  </div>
</template>

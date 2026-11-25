<script setup lang="ts">
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import TelaDeModulos from './_TelaDeModulos.vue'
import TelaDeInbox from './_TelaDeInbox.vue'
import TelaDeRelatorios from './_TelaDeRelatorios.vue'
import TelaDeDashboards from './_TelaDeDashboards.vue'
import { useMeusRelatorios } from './relatorios'
import type { FormatoDoRelatorio } from './mocks'
import type { Categoria } from './mocks'
import type { TextosDaTela } from './textos'

/**
 * O miolo da direita. Ilustrativo de propósito: o que está sendo proposto é a
 * navegação da esquerda, e a regra 19 diz para não resolver na tela B um problema
 * da tela A.
 *
 * Só uma parte daqui é proposta de verdade: na tela da categoria, os FORMULÁRIOS
 * viram aba. É onde o terceiro nível do menu de hoje (Categorias > leve > Todos)
 * deixa de existir, então precisa estar visível.
 */
const props = defineProps<{
  t: TextosDaTela
  destino: string
  rotuloDoDestino: string
  categoria: Categoria | null
  /** Para dar nome à categoria de cada dashboard (rodada 35). */
  categorias: Categoria[]
  /** Qual item das configurações está aberto, quando o painel é o de config. */
  itemConfig?: string
}>()

const emit = defineEmits<{ configurarCategoria: [], irPara: [destino: string] }>()

/*
 * EXTRAIR RELATÓRIO (rodada 22). Cópia do develop: o ícone no canto da tabela
 * abre "Relatório Padrão", que abre a escolha do formato (Excel, CSV, DBF).
 * O que é proposta é o aviso: no develop ele aponta para "Meus Relatórios
 * Emitidos", uma tela que não está no menu; aqui ele abre o destino do menu.
 */
const relatorios = useMeusRelatorios()
const toast = useToast()
const escolhendoFormato = ref(false)
const formatos: FormatoDoRelatorio[] = ['Excel', 'CSV', 'DBF']

const itensDeExtrair = computed(() => [[
  { label: props.t.relatorioPadrao, icon: 'i-lucide-file-spreadsheet', onSelect: () => { escolhendoFormato.value = true } },
]])

function extrair(formato: FormatoDoRelatorio) {
  escolhendoFormato.value = false
  relatorios.extrair(formato)
  toast.add({
    title: props.t.relatorioEmProcessamento,
    description: props.t.relatorioEmProcessamentoDescricao,
    icon: 'i-lucide-file-clock',
    color: 'neutral',
    // Aviso com ação precisa de tempo para a ação: os 5 s padrão somem antes do clique.
    duration: 10000,
    actions: [{
      label: props.t.abrirMeusRelatorios,
      color: 'neutral',
      variant: 'outline',
      onClick: () => emit('irPara', 'n-relatorios'),
    }],
  })
}

/** Aba ativa da categoria: "Todos" mais um por formulário. */
const abaAtiva = ref('todos')
watch(() => props.categoria?.id, () => { abaAtiva.value = 'todos' })

const abas = computed(() => {
  if (!props.categoria) return []
  return [
    { value: 'todos', label: props.t.todosOsItens },
    ...props.categoria.formularios.map(f => ({ value: f, label: f })),
  ]
})

const colunas = computed<EnTableColumn[]>(() => [
  { key: 'referencia', label: '#' },
  { key: 'titulo', label: props.t.todosOsItens },
  { key: 'responsavel', label: 'Owner' },
  { key: 'status', label: 'Status' },
])

/** Linhas ilustrativas, fictícias, que mudam com a aba para a troca ser visível. */
const linhas = computed(() => {
  const base = props.categoria?.formularios ?? []
  const formulario = abaAtiva.value === 'todos' ? base[0] ?? '' : abaAtiva.value
  const semente = formulario.length + (props.categoria?.id ?? 0)
  return Array.from({ length: 6 }, (_, i) => ({
    referencia: `${1240 + semente * 7 + i}`,
    titulo: `${props.categoria?.name ?? ''} ${1240 + semente * 7 + i}`,
    responsavel: ['Rita A.', 'Caio M.', 'Lúcia P.', 'Tiago R.'][(i + semente) % 4],
    status: ['Em análise', 'Aprovado', 'Pendente', 'Concluído'][(i + semente) % 4],
  }))
})
</script>

<template>
  <div class="flex min-w-0 flex-1 flex-col bg-default">
    <!--
      Rodada 35: a linha com o caminho e o "Configurar categoria" saiu. Hoje a
      trilha mora na barra do topo, e a engrenagem da categoria mora na barra
      de ferramentas da lista (print do develop de 2026-11-24).
    -->
    <div class="min-h-0 flex-1 overflow-y-auto p-5">
      <!--
        A tela de Módulos é a única do miolo que não é maquete: é o mecanismo
        que a demanda mandou mostrar, e ligar um módulo mexe no menu de verdade.
      -->
      <TelaDeModulos v-if="props.itemConfig === 'modulos'" :t="props.t" />

      <!--
        O Inbox tambem e mecanismo, nao maquete: o contador da barra e esta
        lista leem o mesmo estado, e abrir uma notificacao baixa o numero la.
      -->
      <TelaDeInbox v-else-if="props.destino === 'n-inbox'" :t="props.t" />

      <!-- Meus relatórios, rodada 22: a tela /myReports do develop, com a porta no menu. -->
      <TelaDeRelatorios v-else-if="props.destino === 'n-relatorios'" :t="props.t" @ver-modelo="emit('configurarCategoria')" />

      <!-- Dashboards de itens, rodada 35: a tela central e o dashboard aberto pelo menu. -->
      <TelaDeDashboards
        v-else-if="props.destino === 't-dashboards' || props.destino.startsWith('dash:')"
        :t="props.t"
        :destino="props.destino"
        :categorias="props.categorias"
        @ir-para="d => emit('irPara', d)"
      />

      <!-- ---------------- tela de uma categoria ---------------- -->
      <div v-else-if="props.categoria" :key="props.categoria.id" class="-mx-5 -mt-5 animate-[entrada_0.25s_ease-out_both]">
        <!--
          Como no develop (2026-11-24): a tela da categoria não tem título; em
          cima ficam as abas, e embaixo a barra de ferramentas da lista.
          AQUI mora a proposta: o formulário virou ABA. No menu de hoje ele é o
          terceiro nível (Categorias > leve > AUD Formulario).
        -->
        <div class="flex flex-wrap items-center gap-1 border-b border-default px-3 py-1.5">
          <UButton
            v-for="aba in abas"
            :key="aba.value"
            :label="aba.label"
            icon="i-lucide-table"
            size="sm"
            color="neutral"
            :variant="abaAtiva === aba.value ? 'soft' : 'ghost'"
            @click="abaAtiva = aba.value"
          />
          <UButton
            :label="props.t.novaVisualizacao"
            icon="i-lucide-plus"
            size="sm"
            color="neutral"
            variant="ghost"
            class="text-muted"
          />
        </div>

        <!-- A barra de ferramentas da lista, como hoje. A engrenagem configura a categoria. -->
        <div class="flex items-center gap-1 border-b border-default px-3 py-2">
          <UInput icon="i-lucide-search" :placeholder="props.t.listaPesquisar" size="sm" variant="ghost" class="w-52" />
          <UButton icon="i-lucide-calendar" :label="props.t.criadoEmRotulo" size="sm" color="neutral" variant="ghost" class="text-muted" />
          <UButton icon="i-lucide-arrow-down-up" :label="props.t.listaTodoPeriodo" size="sm" color="neutral" variant="ghost" class="text-muted" />

          <span class="flex-1" />

          <!-- O ícone do develop, no canto da tabela. -->
          <UDropdownMenu :items="itensDeExtrair" :content="{ align: 'end' }">
            <UTooltip :text="props.t.extrairRelatorio">
              <UButton icon="i-lucide-file-down" size="sm" color="neutral" variant="ghost" :aria-label="props.t.extrairRelatorio" />
            </UTooltip>
          </UDropdownMenu>
          <UTooltip :text="props.t.listaColunas">
            <UButton icon="i-lucide-columns-2" size="sm" color="neutral" variant="ghost" :aria-label="props.t.listaColunas" />
          </UTooltip>
          <UTooltip :text="props.t.listaFiltros">
            <UButton icon="i-lucide-sliders-horizontal" size="sm" color="neutral" variant="ghost" :aria-label="props.t.listaFiltros" />
          </UTooltip>
          <UTooltip :text="props.t.configurarCategoria">
            <UButton icon="i-lucide-settings" size="sm" color="neutral" variant="ghost" :aria-label="props.t.configurarCategoria" @click="emit('configurarCategoria')" />
          </UTooltip>
          <UButton icon="i-lucide-plus" :label="props.t.listaNovoRegistro" size="sm" color="primary" variant="soft" class="ml-1" />
        </div>

        <EnTable :key="abaAtiva" :columns="colunas" :rows="linhas" />
      </div>

      <!-- ---------------- qualquer outro destino ---------------- -->
      <div v-else class="animate-[entrada_0.25s_ease-out_both]">
        <h1 class="mb-4 text-xl font-bold text-highlighted">{{ props.rotuloDoDestino }}</h1>
        <div class="grid gap-3 sm:grid-cols-3">
          <div
            v-for="n in 3"
            :key="n"
            class="rounded-xl border border-default p-4"
          >
            <USkeleton class="h-3 w-20" />
            <USkeleton class="mt-3 h-7 w-12" />
          </div>
        </div>
        <div class="mt-3 rounded-xl border border-default p-4">
          <USkeleton v-for="n in 5" :key="n" class="mb-2.5 h-3" :class="n === 1 ? 'w-1/3' : 'w-full'" />
        </div>
      </div>

      <p v-if="props.itemConfig !== 'modulos' && props.destino !== 'n-inbox' && props.destino !== 'n-relatorios'" class="mt-4 text-xs text-muted">
        {{ props.t.conteudoIlustrativo }}
      </p>
    </div>

    <!-- A escolha do formato, como no develop: três botões, sem outro campo. -->
    <UModal v-model:open="escolhendoFormato" :title="props.t.formatoTitulo" :description="props.t.formatoDescricao" :ui="{ content: 'max-w-sm' }">
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton v-for="f in formatos" :key="f" :label="f" size="sm" color="neutral" variant="soft" @click="extrair(f)" />
        </div>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import TelaDeModulos from './_TelaDeModulos.vue'
import TelaDeInbox from './_TelaDeInbox.vue'
import TelaDeRelatorios from './_TelaDeRelatorios.vue'
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
  breadcrumb: string[]
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
    <!-- Barra superior: o caminho e as ações da tela. -->
    <header class="flex h-14 shrink-0 items-center gap-2 border-b border-default px-5">
      <nav class="flex min-w-0 items-center gap-1.5 text-sm" aria-label="breadcrumb">
        <template v-for="(p, i) in props.breadcrumb" :key="i">
          <span v-if="i > 0" class="text-muted" aria-hidden="true">/</span>
          <span
            class="truncate"
            :class="i === props.breadcrumb.length - 1 ? 'font-semibold text-highlighted' : 'text-muted'"
          >{{ p }}</span>
        </template>
      </nav>

      <span class="flex-1" />

      <UButton
        v-if="props.categoria"
        :label="props.t.configurarCategoria"
        icon="i-lucide-settings-2"
        size="sm"
        color="neutral"
        variant="subtle"
        @click="emit('configurarCategoria')"
      />
    </header>

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

      <!-- ---------------- tela de uma categoria ---------------- -->
      <div v-else-if="props.categoria" :key="props.categoria.id" class="animate-[entrada_0.25s_ease-out_both]">
        <div class="mb-4 flex items-center gap-3">
          <UIcon :name="props.categoria.icon ?? 'i-lucide-folder'" class="size-6 text-toned" />
          <div class="min-w-0">
            <h1 class="truncate text-xl font-bold text-highlighted">{{ props.categoria.name }}</h1>
            <p v-if="props.categoria.description" class="truncate text-sm text-muted">
              {{ props.categoria.description }}
            </p>
          </div>
        </div>

        <!--
          AQUI mora a proposta: o formulário virou ABA.
          No menu de hoje ele é o terceiro nível (Categorias > leve > AUD Formulario).
        -->
        <div class="mb-3 flex flex-wrap items-center gap-2 border-b border-default pb-2">
          <UButton
            v-for="aba in abas"
            :key="aba.value"
            :label="aba.label"
            size="sm"
            :color="abaAtiva === aba.value ? 'primary' : 'neutral'"
            :variant="abaAtiva === aba.value ? 'soft' : 'ghost'"
            @click="abaAtiva = aba.value"
          />
          <UButton
            :label="props.t.novaVisualizacao"
            icon="i-lucide-plus"
            size="sm"
            color="neutral"
            variant="link"
          />

          <span class="flex-1" />

          <!-- O ícone do develop, no canto da tabela. -->
          <UDropdownMenu :items="itensDeExtrair" :content="{ align: 'end' }">
            <UTooltip :text="props.t.extrairRelatorio">
              <UButton icon="i-lucide-file-down" size="sm" color="neutral" variant="ghost" :aria-label="props.t.extrairRelatorio" />
            </UTooltip>
          </UDropdownMenu>
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

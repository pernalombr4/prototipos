<script setup lang="ts">
/**
 * O cabeçalho do quadro.
 *
 * O que muda em relação ao de hoje: agrupar, ordenar, filtrar e escolher os
 * campos do cartão existem no produto, mas só dentro do modal "Nova
 * Visualização", na hora de criar a tela. Aqui eles saem para a barra, onde a
 * pessoa mexe no que está vendo sem precisar criar outra visualização.
 *
 * O que NÃO muda: o endereço das ações que já existiam. "Nova tarefa" continua
 * na ponta direita, as visualizações continuam na primeira linha, e os quatro
 * ícones da direita continuam lá. O que eles ganham é rótulo (regra 16).
 */
import type { Task } from '@be-enlighten/enspace-sdk-schemas'
import { pessoas, visualizacoes } from './mocks'
import { ordenacoes, type ChaveAgrupamento, type ChaveOrdenacao } from './quadro'
import type { Textos } from './textos'

export interface Filtros {
  status: Task['status'][]
  prioridade: Task['priority'][]
  responsavel: number[]
  tipo: Task['type'][]
  somenteMinhas: boolean
  somenteAtrasadas: boolean
  semResponsavel: boolean
}

const props = defineProps<{
  t: Textos
  total: number
  visiveis: number
  raias: { valor: string, rotulo: string }[]
  somenteLeitura?: boolean
}>()

const emit = defineEmits<{ novaTarefa: [], limpar: [] }>()

const busca = defineModel<string>('busca', { required: true })
const agrupamento = defineModel<ChaveAgrupamento>('agrupamento', { required: true })
const ordenacao = defineModel<ChaveOrdenacao>('ordenacao', { required: true })
const ordenacaoDesc = defineModel<boolean>('ordenacaoDesc', { required: true })
const densidade = defineModel<'compacto' | 'padrao' | 'completo'>('densidade', { required: true })
const campos = defineModel<Record<string, boolean>>('campos', { required: true })
const filtros = defineModel<Filtros>('filtros', { required: true })
const periodo = defineModel<string>('periodo', { required: true })
const campoDeData = defineModel<'created_at' | 'due_date'>('campoDeData', { required: true })
const ocultarVazias = defineModel<boolean>('ocultarVazias', { required: true })
const raiasOcultas = defineModel<string[]>('raiasOcultas', { required: true })
const visualizacaoAtual = defineModel<string>('visualizacao', { required: true })

/** Computado, não constante: a barra troca de idioma junto com a tela. */
const agrupamentos = computed<{ valor: ChaveAgrupamento, rotulo: string, jaExiste: boolean }[]>(() => [
  { valor: 'status', rotulo: props.t.campos.status, jaExiste: true },
  { valor: 'priority', rotulo: props.t.campos.prioridade, jaExiste: true },
  { valor: 'assigned_to', rotulo: props.t.campos.responsavel, jaExiste: true },
  { valor: 'type', rotulo: props.t.campos.tipo, jaExiste: false },
  { valor: 'due_date', rotulo: props.t.campos.prazo, jaExiste: false },
])

const camposDoCartao = computed<{ chave: string, rotulo: string }[]>(() => [
  { chave: 'referencia', rotulo: props.t.campos.referencia },
  { chave: 'tipo', rotulo: props.t.campos.tipo },
  { chave: 'descricao', rotulo: props.t.campos.descricao },
  { chave: 'prioridade', rotulo: props.t.campos.prioridade },
  { chave: 'prazo', rotulo: props.t.campos.prazo },
  { chave: 'pontos', rotulo: props.t.campos.pontos },
  { chave: 'etiquetas', rotulo: props.t.campos.etiquetas },
  { chave: 'responsavel', rotulo: props.t.campos.responsavel },
  { chave: 'item', rotulo: props.t.campos.item },
  { chave: 'colaboradores', rotulo: props.t.campos.colaboradores },
])

const periodos = computed(() => [
  { valor: 'tudo', rotulo: props.t.todoOPeriodo },
  { valor: 'hoje', rotulo: props.t.venceHoje },
  { valor: '7', rotulo: props.t.venceEmDias(7) },
  { valor: '30', rotulo: props.t.venceEmDias(30) },
])

const listaDePessoas = Object.values(pessoas)

/** Quantos filtros estão ligados. É o número que vai no selo da barra. */
const quantosFiltros = computed(() => {
  const f = filtros.value
  return f.status.length + f.prioridade.length + f.responsavel.length + f.tipo.length
    + (f.somenteMinhas ? 1 : 0) + (f.somenteAtrasadas ? 1 : 0) + (f.semResponsavel ? 1 : 0)
    + (periodo.value !== 'tudo' ? 1 : 0)
    + (busca.value ? 1 : 0)
})

/** Os chips que descrevem o estado atual, com o X para tirar um a um. */
const chips = computed(() => {
  const lista: { chave: string, rotulo: string, remover: () => void }[] = []
  if (busca.value) {
    lista.push({ chave: 'busca', rotulo: `"${busca.value}"`, remover: () => { busca.value = '' } })
  }
  for (const s of filtros.value.status) {
    lista.push({ chave: `s-${s}`, rotulo: props.t.status[s], remover: () => { filtros.value.status = filtros.value.status.filter(x => x !== s) } })
  }
  for (const p of filtros.value.prioridade) {
    lista.push({ chave: `p-${p}`, rotulo: props.t.prioridade[p], remover: () => { filtros.value.prioridade = filtros.value.prioridade.filter(x => x !== p) } })
  }
  for (const id of filtros.value.responsavel) {
    lista.push({ chave: `r-${id}`, rotulo: pessoas[id]?.fullname ?? '', remover: () => { filtros.value.responsavel = filtros.value.responsavel.filter(x => x !== id) } })
  }
  for (const tp of filtros.value.tipo) {
    lista.push({ chave: `t-${tp}`, rotulo: props.t.tipo[tp], remover: () => { filtros.value.tipo = filtros.value.tipo.filter(x => x !== tp) } })
  }
  if (filtros.value.somenteMinhas) {
    lista.push({ chave: 'minhas', rotulo: visualizacoes[1]!.nome, remover: () => { filtros.value.somenteMinhas = false } })
  }
  if (filtros.value.somenteAtrasadas) {
    lista.push({ chave: 'atrasadas', rotulo: props.t.calculos.atrasadas, remover: () => { filtros.value.somenteAtrasadas = false } })
  }
  if (filtros.value.semResponsavel) {
    lista.push({ chave: 'semresp', rotulo: props.t.semResponsavel, remover: () => { filtros.value.semResponsavel = false } })
  }
  if (periodo.value !== 'tudo') {
    const p = periodos.value.find(x => x.valor === periodo.value)
    lista.push({ chave: 'periodo', rotulo: p?.rotulo ?? '', remover: () => { periodo.value = 'tudo' } })
  }
  return lista
})

function alternar<T>(lista: T[], valor: T): T[] {
  return lista.includes(valor) ? lista.filter(x => x !== valor) : [...lista, valor]
}

const itensDeMais = computed(() => [[
  { label: props.t.relatorios, icon: 'i-lucide-chart-no-axes-column' },
  { label: props.t.exportar, icon: 'i-lucide-file-down' },
], [
  { label: props.t.arquivadas, icon: 'i-lucide-archive' },
  { label: props.t.lixeira, icon: 'i-lucide-trash-2' },
]])

const itensDeOrdenacao = computed(() => [
  ordenacoes.map(o => ({
    label: props.t.campos[o.rotulo],
    icon: ordenacao.value === o.valor ? 'i-lucide-check' : 'i-lucide-minus',
    onSelect: () => { ordenacao.value = o.valor },
  })),
  [{
    label: ordenacaoDesc.value ? props.t.decrescente : props.t.crescente,
    icon: ordenacaoDesc.value ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide',
    onSelect: () => { ordenacaoDesc.value = !ordenacaoDesc.value },
  }],
])

const rotuloDaOrdenacao = computed(() => {
  const o = ordenacoes.find(x => x.valor === ordenacao.value)
  if (!o) return props.t.ordenar
  return props.t.campos[o.rotulo]
})
</script>

<template>
  <div class="border-b border-default bg-default">
    <!-- Linha 1: as visualizações salvas, como no produto -->
    <div class="flex items-center gap-1 px-4 pt-2">
      <div class="flex items-center gap-0.5 overflow-x-auto">
        <UButton
          v-for="v in visualizacoes"
          :key="v.id"
          :label="v.nome"
          :icon="v.icone"
          size="xs"
          :color="visualizacaoAtual === v.id ? 'primary' : 'neutral'"
          :variant="visualizacaoAtual === v.id ? 'soft' : 'ghost'"
          class="shrink-0"
          @click="visualizacaoAtual = v.id"
        />
        <UButton
          :label="t.novaVisualizacao"
          icon="i-lucide-plus"
          size="xs"
          color="neutral"
          variant="ghost"
          class="shrink-0 text-muted"
        />
      </div>
    </div>

    <!-- Linha 2: os comandos do quadro -->
    <div class="flex flex-wrap items-center gap-1.5 px-4 py-2">
      <UInput
        v-model="busca"
        icon="i-lucide-search"
        :placeholder="t.buscar"
        size="sm"
        class="w-56"
        :ui="{ trailing: 'pe-1' }"
      >
        <template v-if="busca" #trailing>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="link"
            size="xs"
            :aria-label="t.limparFiltros"
            @click="busca = ''"
          />
        </template>
      </UInput>

      <!-- Filtros -->
      <UPopover>
        <UButton
          icon="i-lucide-list-filter"
          :label="t.filtros"
          size="sm"
          :color="quantosFiltros ? 'primary' : 'neutral'"
          :variant="quantosFiltros ? 'soft' : 'outline'"
        >
          <template v-if="quantosFiltros" #trailing>
            <UBadge :label="String(quantosFiltros)" color="primary" variant="solid" size="sm" />
          </template>
        </UButton>

        <template #content>
          <div class="w-72 divide-y divide-default">
            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.campos.status }}</p>
              <div class="flex flex-wrap gap-1">
                <UButton
                  v-for="s in (['pending', 'working', 'blocked', 'completed'] as const)"
                  :key="s"
                  :label="t.status[s]"
                  size="xs"
                  :color="filtros.status.includes(s) ? 'primary' : 'neutral'"
                  :variant="filtros.status.includes(s) ? 'soft' : 'outline'"
                  @click="filtros.status = alternar(filtros.status, s)"
                />
              </div>
            </div>

            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.campos.prioridade }}</p>
              <div class="flex flex-wrap gap-1">
                <UButton
                  v-for="p in (['urgent', 'high', 'normal', 'low'] as const)"
                  :key="p"
                  :label="t.prioridade[p]"
                  size="xs"
                  :color="filtros.prioridade.includes(p) ? 'primary' : 'neutral'"
                  :variant="filtros.prioridade.includes(p) ? 'soft' : 'outline'"
                  @click="filtros.prioridade = alternar(filtros.prioridade, p)"
                />
              </div>
            </div>

            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.campos.responsavel }}</p>
              <div class="space-y-1.5">
                <UCheckbox
                  v-for="p in listaDePessoas"
                  :key="p.id"
                  :model-value="filtros.responsavel.includes(p.id)"
                  :label="p.fullname"
                  size="sm"
                  @update:model-value="filtros.responsavel = alternar(filtros.responsavel, p.id)"
                />
              </div>
            </div>

            <div class="space-y-1.5 p-3">
              <UCheckbox v-model="filtros.somenteMinhas" :label="visualizacoes[1]!.nome" size="sm" />
              <UCheckbox v-model="filtros.somenteAtrasadas" :label="t.calculos.atrasadas" size="sm" />
              <UCheckbox v-model="filtros.semResponsavel" :label="t.semResponsavel" size="sm" />
            </div>
          </div>
        </template>
      </UPopover>

      <!-- Agrupar -->
      <UPopover>
        <UButton
          icon="i-lucide-columns-3"
          size="sm"
          color="neutral"
          variant="outline"
        >
          <span class="text-muted">{{ t.agrupar }}:</span>
          <span class="font-medium">{{ agrupamentos.find(a => a.valor === agrupamento)?.rotulo }}</span>
        </UButton>
        <template #content>
          <div class="w-64 p-1.5">
            <p class="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.agruparPor }}</p>
            <UButton
              v-for="a in agrupamentos"
              :key="a.valor"
              :label="a.rotulo"
              :icon="agrupamento === a.valor ? 'i-lucide-check' : 'i-lucide-minus'"
              block
              size="sm"
              color="neutral"
              :variant="agrupamento === a.valor ? 'soft' : 'ghost'"
              class="justify-start"
              @click="agrupamento = a.valor"
            />
            <USeparator class="my-1.5" />
            <div class="px-2 pb-1">
              <USwitch v-model="ocultarVazias" :label="t.ocultarVazias" size="sm" />
            </div>
          </div>
        </template>
      </UPopover>

      <!-- Ordenar -->
      <UDropdownMenu :items="itensDeOrdenacao">
        <UButton
          :icon="ordenacaoDesc ? 'i-lucide-arrow-down-wide-narrow' : 'i-lucide-arrow-up-narrow-wide'"
          size="sm"
          color="neutral"
          variant="outline"
        >
          <span class="text-muted">{{ t.ordenar }}:</span>
          <span class="font-medium">{{ rotuloDaOrdenacao }}</span>
        </UButton>
      </UDropdownMenu>

      <!-- Cartão: campos e tamanho -->
      <UPopover>
        <UButton icon="i-lucide-credit-card" :label="t.cartao" size="sm" color="neutral" variant="outline" />
        <template #content>
          <div class="w-64 divide-y divide-default">
            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.densidade }}</p>
              <div class="flex gap-1">
                <UButton
                  v-for="d in (['compacto', 'padrao', 'completo'] as const)"
                  :key="d"
                  :label="t.densidades[d]"
                  size="xs"
                  class="flex-1 justify-center"
                  :color="densidade === d ? 'primary' : 'neutral'"
                  :variant="densidade === d ? 'soft' : 'outline'"
                  @click="densidade = d"
                />
              </div>
            </div>
            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.camposDoCartao }}</p>
              <div class="space-y-1.5">
                <UCheckbox
                  v-for="c in camposDoCartao"
                  :key="c.chave"
                  :model-value="campos[c.chave]"
                  :label="c.rotulo"
                  size="sm"
                  @update:model-value="(v) => campos = { ...campos, [c.chave]: !!v }"
                />
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <!-- Período: o filtro que já existe, agora com atalhos -->
      <UPopover>
        <UButton icon="i-lucide-calendar-range" size="sm" color="neutral" variant="outline">
          <span class="font-medium">{{ periodos.find(p => p.valor === periodo)?.rotulo }}</span>
        </UButton>
        <template #content>
          <div class="w-60 divide-y divide-default">
            <div class="p-1.5">
              <UButton
                v-for="p in periodos"
                :key="p.valor"
                :label="p.rotulo"
                :icon="periodo === p.valor ? 'i-lucide-check' : 'i-lucide-minus'"
                block
                size="sm"
                color="neutral"
                :variant="periodo === p.valor ? 'soft' : 'ghost'"
                class="justify-start"
                @click="periodo = p.valor"
              />
            </div>
            <div class="p-3">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.campoDeData }}</p>
              <div class="flex gap-1">
                <UButton
                  :label="t.campos.criadoEm"
                  size="xs"
                  class="flex-1 justify-center"
                  :color="campoDeData === 'created_at' ? 'primary' : 'neutral'"
                  :variant="campoDeData === 'created_at' ? 'soft' : 'outline'"
                  @click="campoDeData = 'created_at'"
                />
                <UButton
                  :label="t.campos.prazo"
                  size="xs"
                  class="flex-1 justify-center"
                  :color="campoDeData === 'due_date' ? 'primary' : 'neutral'"
                  :variant="campoDeData === 'due_date' ? 'soft' : 'outline'"
                  @click="campoDeData = 'due_date'"
                />
              </div>
            </div>
          </div>
        </template>
      </UPopover>

      <!-- Direita: o que já estava na direita continua na direita -->
      <div class="ml-auto flex items-center gap-1.5">
        <UPopover>
          <UButton icon="i-lucide-panels-top-left" :label="t.raiasVisiveis" size="sm" color="neutral" variant="ghost" />
          <template #content>
            <div class="w-60 p-1.5">
              <p class="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted">{{ t.raiasVisiveis }}</p>
              <div class="space-y-1.5 px-2 py-1">
                <UCheckbox
                  v-for="r in raias"
                  :key="r.valor"
                  :model-value="!raiasOcultas.includes(r.valor)"
                  :label="r.rotulo"
                  size="sm"
                  @update:model-value="raiasOcultas = alternar(raiasOcultas, r.valor)"
                />
              </div>
              <USeparator class="my-1.5" />
              <UButton
                :label="t.mostrarTodas"
                icon="i-lucide-eye"
                block
                size="sm"
                color="neutral"
                variant="ghost"
                class="justify-start"
                @click="raiasOcultas = []"
              />
            </div>
          </template>
        </UPopover>

        <UDropdownMenu :items="itensDeMais">
          <UButton icon="i-lucide-ellipsis" :label="t.mais" size="sm" color="neutral" variant="ghost" />
        </UDropdownMenu>

        <UButton
          icon="i-lucide-plus"
          :label="t.novaTarefa"
          size="sm"
          color="primary"
          :disabled="somenteLeitura"
          @click="emit('novaTarefa')"
        />
      </div>
    </div>

    <!-- Linha 3: o que está valendo agora, em texto -->
    <div class="flex flex-wrap items-center gap-1.5 px-4 pb-2">
      <span class="text-xs font-medium text-muted">{{ t.resumo(total, visiveis) }}</span>
      <template v-if="chips.length">
        <USeparator orientation="vertical" class="h-4" />
        <UBadge
          v-for="c in chips"
          :key="c.chave"
          color="neutral"
          variant="subtle"
          size="sm"
          class="gap-1 pe-1"
        >
          {{ c.rotulo }}
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="link"
            size="xs"
            class="p-0"
            :aria-label="`${t.limparFiltros} ${c.rotulo}`"
            @click="c.remover()"
          />
        </UBadge>
        <UButton
          :label="t.limparFiltros"
          size="xs"
          color="neutral"
          variant="link"
          @click="emit('limpar')"
        />
      </template>
    </div>
  </div>
</template>

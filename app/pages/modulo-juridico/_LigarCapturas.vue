<script setup lang="ts">
/**
 * PROPOSTA (rodada 4): ligar o submódulo Capturas pede a categoria que guarda os processos.
 *
 * O módulo não traz tela própria de processos: o processo continua sendo item de uma categoria do workspace, com as
 * telas de categoria que o produto já tem. Ao ligar Capturas, a pessoa escolhe essa categoria (ou cria Processos pelo
 * caso de uso Contencioso) e liga os campos de que a captura precisa: o número CNJ para achar o processo, o tribunal
 * para o calendário, o responsável para o prazo e o polo para saber se a empresa é ré. O campo que falta é criado.
 * Os campos ligados ficam travados enquanto o submódulo estiver ligado.
 */
import type { CategoriaId } from './mocks'
import { categorias, processos } from './mocks'
import { estado } from './estado'
import type { CampoExigido, LigacaoDaCategoria } from './tratamento'
import { camposDaCategoria, camposExigidos, campoNovo, itensPorCategoria, sugerirLigacao } from './tratamento'
import { textosTratamento } from './textos-tratamento'
import type { Textos } from './textos'

defineProps<{ t: Textos }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ ligado: [] }>()
const tt = useTextos(textosTratamento)
const toast = useToast()

const CRIAR = '__criar'
type Escolha = CategoriaId | 'casoDeUso'

const escolha = ref<Escolha>(estado.ligacao.origem === 'casoDeUso' ? 'casoDeUso' : estado.ligacao.categoria)
const campos = ref<Record<CampoExigido, string | undefined>>(sugerirLigacao('processos'))
watch(open, (v) => { if (v) campos.value = escolha.value === 'casoDeUso' ? criarTodos() : sugerirLigacao(escolha.value) })
watch(escolha, (c) => { campos.value = c === 'casoDeUso' ? criarTodos() : sugerirLigacao(c) })

function criarTodos() {
  return Object.fromEntries(camposExigidos.map(c => [c.id, CRIAR])) as Record<CampoExigido, string>
}

const itensDeCategoria = computed(() => [
  ...categorias
    .filter(c => c.id !== 'audiencias')
    .map(c => ({
      label: c.nome,
      value: c.id as Escolha,
      icon: c.icone,
      description: `${tt.value.ligacao.itens(c.id === 'processos' ? processos.length : itensPorCategoria[c.id] ?? 0)}. ${tt.value.ligacao.existenteAjuda}`,
    })),
  { label: tt.value.ligacao.casoDeUso, value: 'casoDeUso' as Escolha, icon: 'i-lucide-package-plus', description: tt.value.ligacao.casoDeUsoAjuda },
])

const doCasoDeUso = computed(() => escolha.value === 'casoDeUso')
const camposDisponiveis = computed(() => (doCasoDeUso.value ? [] : camposDaCategoria[escolha.value as CategoriaId] ?? []))

function opcoes(id: CampoExigido) {
  const tipo = camposExigidos.find(c => c.id === id)!.tipo
  // Um campo da categoria serve a um campo do submódulo só.
  const usados = new Set(camposExigidos.filter(c => c.id !== id).map(c => campos.value[c.id]))
  return [
    ...camposDisponiveis.value.filter(c => c.tipo === tipo && !usados.has(c.nome)).map(c => ({ label: c.nome, value: c.nome })),
    { label: tt.value.ligacao.criar(campoNovo[id]), value: CRIAR, icon: 'i-lucide-plus' },
  ]
}

const faltam = computed(() => camposExigidos.filter(c => c.obrigatorio && !campos.value[c.id]).length)

const ligando = ref(false)
async function ligar() {
  ligando.value = true
  await new Promise(r => setTimeout(r, 700))
  ligando.value = false
  const criados = camposExigidos.filter(c => campos.value[c.id] === CRIAR).map(c => c.id)
  const ligacao: LigacaoDaCategoria = {
    categoria: doCasoDeUso.value ? 'processos' : escolha.value as CategoriaId,
    origem: doCasoDeUso.value ? 'casoDeUso' : 'existente',
    campos: Object.fromEntries(camposExigidos.map(c => [c.id, campos.value[c.id] === CRIAR ? campoNovo[c.id] : campos.value[c.id]])) as LigacaoDaCategoria['campos'],
    criados,
  }
  estado.ligacao = ligacao
  open.value = false
  emit('ligado')
  const nome = categorias.find(c => c.id === ligacao.categoria)!.nome
  toast.add({
    title: tt.value.ligacao.toast(nome),
    description: criados.length ? tt.value.ligacao.toastCriados(criados.length) : undefined,
    icon: 'i-lucide-scale',
    color: 'success',
  })
}
</script>

<template>
  <UModal v-model:open="open" :title="tt.ligacao.titulo" :description="tt.ligacao.desc" :ui="{ content: 'sm:max-w-2xl' }">
    <template #body>
      <div class="flex flex-col gap-5">
        <UFormField :label="tt.ligacao.categoria" required>
          <USelect v-model="escolha" :items="itensDeCategoria" class="w-full" :ui="{ content: 'min-w-(--reka-select-trigger-width)' }" />
        </UFormField>
        <Transition enter-active-class="transition-[opacity,transform] duration-200" enter-from-class="opacity-0 -translate-y-1" leave-active-class="transition-opacity duration-100" leave-to-class="opacity-0">
          <UAlert v-if="doCasoDeUso" :description="tt.ligacao.duplicada" icon="i-lucide-copy" color="warning" variant="subtle" />
        </Transition>

        <div class="flex flex-col gap-2">
          <p class="text-sm font-medium text-highlighted">{{ tt.ligacao.campos }}</p>
          <div class="overflow-hidden rounded-md border border-default">
            <div class="grid grid-cols-[minmax(0,1fr)_6rem_minmax(0,1.4fr)] gap-3 border-b border-default bg-elevated/50 px-3 py-2 text-xs font-medium text-muted">
              <span>{{ tt.ligacao.colunas.campo }}</span>
              <span>{{ tt.ligacao.colunas.tipo }}</span>
              <span>{{ tt.ligacao.colunas.daCategoria }}</span>
            </div>
            <div
              v-for="c in camposExigidos"
              :key="c.id"
              class="grid grid-cols-[minmax(0,1fr)_6rem_minmax(0,1.4fr)] items-center gap-3 border-b border-default px-3 py-2 last:border-b-0"
            >
              <span class="flex flex-wrap items-center gap-1.5 text-sm text-highlighted">
                {{ tt.ligacao.nomes[c.id] }}
                <UBadge v-if="!c.obrigatorio" :label="tt.ligacao.opcional" color="neutral" variant="outline" size="sm" />
              </span>
              <span class="text-sm text-toned">{{ tt.ligacao.tipos[c.tipo] }}</span>
              <USelect
                v-model="campos[c.id]"
                :items="opcoes(c.id)"
                :placeholder="tt.ligacao.escolher"
                :disabled="doCasoDeUso"
                :color="c.obrigatorio && !campos[c.id] ? 'warning' : 'neutral'"
                :highlight="c.obrigatorio && !campos[c.id]"
                size="sm"
                class="w-full"
                :aria-label="tt.ligacao.nomes[c.id]"
              />
            </div>
          </div>
          <p v-if="faltam" class="flex items-center gap-1.5 text-xs text-warning">
            <UIcon name="i-lucide-circle-alert" class="size-3.5" />{{ tt.ligacao.faltam(faltam) }}
          </p>
          <p class="flex items-start gap-1.5 text-xs text-muted">
            <UIcon name="i-lucide-lock" class="mt-0.5 size-3.5 shrink-0" />{{ tt.ligacao.travados }}
          </p>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end gap-2">
        <UButton :label="t.geral.cancelar" color="neutral" variant="outline" @click="open = false" />
        <UButton :label="tt.ligacao.confirmar" icon="i-lucide-power" :loading="ligando" :disabled="faltam > 0" @click="ligar" />
      </div>
    </template>
  </UModal>
</template>

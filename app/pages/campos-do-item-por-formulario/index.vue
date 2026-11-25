<script setup lang="ts">
/**
 * Campos do item com 1 formulário: as 3 soluções da demanda lado a lado com a
 * tela de hoje.
 *
 * Uma porta: a lista da categoria com o item aberto na barra lateral, como no
 * develop. O andaime troca a solução (Hoje, Opção 1, 2 e 3) e a porta por onde
 * o item abre (Todos, página do formulário, tela dedicada). Clicar numa linha
 * abre outro item: o 1º foi criado sem formulário, que é o caso que mais
 * confunde hoje.
 */
import type { Entrada, PastaDeFormulario, Solucao } from './_ItemAberto.vue'
import { textos } from './textos'
import { campos, categoria, formularioPorId, formularios, itens, workspace } from './mocks'
import CascaDoItem from './_CascaDoItem.vue'
import PainelDoItem from './_PainelDoItem.vue'
import ListaDaCategoria from './_ListaDaCategoria.vue'
import ItemAberto from './_ItemAberto.vue'
import ModalNovaPasta from './_ModalNovaPasta.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Campos do item com 1 formulário',
  descricao: 'O item que abre só com os campos do único formulário da categoria, e as 3 soluções da demanda lado a lado com a tela de hoje.',
  status: 'em-revisao',
  atualizado: '2026-11-25',
  tela: 'Tela do item, barra lateral do item e página do formulário',
})

const t = useTextos(textos)
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime: solução e porta vão para o endereço ---------- */
const SOLUCOES: Solucao[] = ['hoje', 'op1', 'op2', 'op3']
const ENTRADAS: Entrada[] = ['todos', 'formulario', 'tela']

const solucao = computed<Solucao>({
  get: () => (SOLUCOES.includes(route.query.solucao as Solucao) ? route.query.solucao : 'hoje') as Solucao,
  set: v => router.replace({ query: { ...route.query, solucao: v } }),
})
const entrada = computed<Entrada>({
  get: () => (ENTRADAS.includes(route.query.entrada as Entrada) ? route.query.entrada : 'todos') as Entrada,
  set: v => router.replace({ query: { ...route.query, entrada: v } }),
})

const complementos = computed<boolean>({
  get: () => route.query.complementos === '1',
  set: v => router.replace({ query: { ...route.query, complementos: v ? '1' : undefined } }),
})

/* ---------- dado em memória: o recarregar zera ---------- */
const lista = ref(itens.map(i => ({ ...i, data: { ...i.data } })))
const formulario = formularios[0]!

const itensDaPorta = computed(() => entrada.value === 'formulario'
  ? lista.value.filter(i => i.form === formulario.id)
  : lista.value)

const colunas = computed(() => entrada.value === 'formulario'
  ? formulario.campos
  : campos.slice(0, 8).map(c => c.refId))

/** Abre já com o item criado sem formulário: é o que mais confunde hoje. */
const selecionado = ref<number | null>(lista.value[0]!.id)
const painelAberto = ref(true)
const painelRecolhido = ref(false)

/* Na página do formulário, o item sem formulário não está na lista. */
watch(entrada, () => {
  if (!itensDaPorta.value.some(i => i.id === selecionado.value)) selecionado.value = itensDaPorta.value[0]!.id
  painelAberto.value = true
})

const item = computed(() => itensDaPorta.value.find(i => i.id === selecionado.value) ?? itensDaPorta.value[0]!)

function abrir(id: number) {
  selecionado.value = id
  painelAberto.value = true
}

function salvar(data: Record<string, string | number>) {
  const i = lista.value.find(x => x.id === item.value.id)
  if (i) { i.data = data; i.updated_at = new Date() }
}

/* ---------- pastas do tipo Formulário: da categoria, valem para todo item ---------- */
const pastasDeFormulario = ref<PastaDeFormulario[]>([])
const modalAberto = ref(false)

function criarPasta(p: { nome: string, formulario: number }) {
  pastasDeFormulario.value = [...pastasDeFormulario.value, { id: `pasta-${Date.now()}`, nome: p.nome, formulario: p.formulario }]
  toast.add({ title: t.value.modal.criada(p.nome), icon: 'i-lucide-folder-plus', color: 'success', duration: 3000 })
}

function aoTeclar(e: KeyboardEvent) {
  if (e.key === 'Escape' && entrada.value !== 'tela' && painelAberto.value && !modalAberto.value) painelAberto.value = false
}
onMounted(() => window.addEventListener('keydown', aoTeclar))
onBeforeUnmount(() => window.removeEventListener('keydown', aoTeclar))

/* ---------- casca ---------- */
const trilha = computed(() => {
  const base = [workspace.name, t.value.casca.categorias, categoria.slug]
  if (entrada.value === 'formulario') return [...base, t.value.casca.formularios, 'Qx7Rk2dPmZ9vT4bNf1Ys']
  if (entrada.value === 'tela') return [...base, item.value.reference]
  return base
})

const origemDoItem = computed(() => {
  const f = formularioPorId(item.value.form)
  return f ? t.value.andaime.peloFormulario(f.nome) : t.value.andaime.semFormulario
})
</script>

<template>
  <div>
    <CascaDoItem :t="t" :trilha="trilha">
      <!-- TELA DEDICADA -->
      <div v-if="entrada === 'tela'" class="flex h-[calc(100dvh-4rem)] min-h-0 pb-28">
        <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" :item="item" />
        <ItemAberto
          :t="t"
          :item="item"
          :solucao="solucao"
          :entrada="entrada"
          :pastas-de-formulario="pastasDeFormulario"
          :complementos="complementos"
          @salvar="salvar"
          @nova-pasta="modalAberto = true"
        />
      </div>

      <!-- LISTA (Todos ou página do formulário) com o item na barra lateral -->
      <div v-else class="relative h-[calc(100dvh-4rem)] overflow-hidden pb-28">
        <ListaDaCategoria
          :t="t"
          :itens="itensDaPorta"
          :colunas="colunas"
          :selecionado="painelAberto ? item.id : null"
          @abrir="abrir"
        />

        <Transition enter-active-class="transition duration-150" enter-from-class="opacity-0" leave-active-class="transition duration-150" leave-to-class="opacity-0">
          <button
            v-if="painelAberto"
            type="button"
            class="absolute inset-0 bg-default/60"
            :aria-label="t.painel.fechar"
            @click="painelAberto = false"
          />
        </Transition>

        <Transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="translate-x-6 opacity-0"
          leave-active-class="transition duration-150 ease-in"
          leave-to-class="translate-x-6 opacity-0"
        >
          <div
            v-if="painelAberto"
            class="absolute inset-y-0 right-0 flex w-2xl max-w-full border-l border-default bg-default pb-28 shadow-xl"
            role="dialog"
            :aria-label="item.reference"
          >
            <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" :item="item" />
            <ItemAberto
              compacto
              :t="t"
              :item="item"
              :solucao="solucao"
              :entrada="entrada"
              :pastas-de-formulario="pastasDeFormulario"
              :complementos="complementos"
              @salvar="salvar"
              @nova-pasta="modalAberto = true"
            />
          </div>
        </Transition>
      </div>
    </CascaDoItem>

    <ModalNovaPasta v-model:aberto="modalAberto" :t="t" @criar="criarPasta" />

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 pt-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.solucao }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="s in SOLUCOES"
            :key="s"
            :color="solucao === s ? 'primary' : 'neutral'"
            :variant="solucao === s ? 'solid' : 'outline'"
            @click="solucao = s"
          >
            {{ t.andaime.solucoes[s] }}
            <UBadge v-if="s === 'op1'" :label="t.andaime.recomendada" size="sm" :color="solucao === s ? 'neutral' : 'primary'" variant="soft" />
          </UButton>
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.entrada }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in ENTRADAS"
            :key="e"
            :label="t.andaime.entradas[e]"
            :color="entrada === e ? 'primary' : 'neutral'"
            :variant="entrada === e ? 'solid' : 'outline'"
            @click="entrada = e"
          />
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <UTooltip :text="t.andaime.dicaComplementos">
          <USwitch v-model="complementos" :label="t.andaime.complementos" :disabled="solucao === 'hoje'" size="sm" :ui="{ label: 'text-xs' }" />
        </UTooltip>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/campos-do-item-por-formulario"
          />
        </span>
      </div>
      <p class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 pb-2.5 pt-1.5 text-xs text-muted" aria-live="polite">
        <span class="flex items-center gap-1.5"><UIcon name="i-lucide-info" class="size-3.5 shrink-0" />{{ t.andaime.dicas[solucao] }}</span>
        <span class="flex items-center gap-1.5"><UIcon name="i-lucide-file" class="size-3.5 shrink-0" />{{ t.andaime.itemAberto }}: <span class="font-mono">{{ item.reference.slice(0, 10) }}</span> · {{ origemDoItem }}</span>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Folders do item: o visual da barra de folders reordenáveis.
 *
 * Uma porta: a tela do item, com o alternador de estilo no andaime (hoje,
 * sublinhado, aba de navegador) e o alternador de onde o item abre (tela
 * própria ou barra lateral sobre a lista). O comportamento é o mesmo nos 3
 * estilos; só o desenho muda.
 */
import type { Estilo } from './_BarraDePastas.vue'
import type { Pasta } from './mocks'
import { textos } from './textos'
import { categoria, item, linhas, pastasIniciais, workspace } from './mocks'
import CascaDoItem from './_CascaDoItem.vue'
import PainelDoItem from './_PainelDoItem.vue'
import BarraDePastas from './_BarraDePastas.vue'
import ConteudoDaPasta from './_ConteudoDaPasta.vue'

import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Folders do item',
  descricao: 'A barra de folders reordenáveis com cara de aba: sublinhado ou aba de navegador, lado a lado com a de hoje.',
  status: 'em-revisao',
  atualizado: '2026-10-08',
  tela: 'Tela do item e barra lateral do item',
})

const t = useTextos(textos)
const toast = useToast()
const route = useRoute()
const router = useRouter()

/* ---------- andaime ---------- */
/** Estilo e modo vão para o endereço: o link abre na versão escolhida. */
const estilo = computed<Estilo>({
  get: () => (['hoje', 'sublinhado', 'navegador'].includes(String(route.query.estilo)) ? route.query.estilo : 'sublinhado') as Estilo,
  set: v => router.replace({ query: { ...route.query, estilo: v } }),
})
const onde = computed<'tela' | 'lateral'>({
  get: () => route.query.onde === 'lateral' ? 'lateral' : 'tela',
  set: v => router.replace({ query: { ...route.query, onde: v } }),
})
const painelRecolhido = ref(onde.value === 'lateral')
watch(onde, (o) => { painelRecolhido.value = o === 'lateral' })

/* ---------- folders ---------- */
const pastas = ref<Pasta[]>([...pastasIniciais])
const nomeDe = (p: Pasta) => p.nome ?? t.value.pastas[p.id] ?? p.id

/**
 * A folder aberta vai para o endereço (`?folder=anexos`): dá para mandar o
 * link de uma folder e o recarregar não volta para a Visão Geral. Twenty faz
 * pelo hash; aqui é a receita de "Tabs com query" do Nuxt UI.
 * No estilo "hoje" não vai, como na preview.
 */
const ativaLocal = ref('visao-geral')
const ativa = computed({
  get: () => estilo.value === 'hoje'
    ? ativaLocal.value
    : (pastas.value.some(p => p.id === route.query.folder) ? String(route.query.folder) : ativaLocal.value),
  set: (id: string) => {
    ativaLocal.value = id
    if (estilo.value !== 'hoje') router.replace({ query: { ...route.query, folder: id } })
  },
})
const pastaAtiva = computed(() => pastas.value.find(p => p.id === ativa.value) ?? pastas.value[0]!)

function desfazerCom(anterior: Pasta[], ativaAntes?: string) {
  return [{
    label: t.value.dialogos.desfazer,
    color: 'neutral' as const,
    variant: 'outline' as const,
    onClick: () => {
      pastas.value = anterior
      if (ativaAntes) ativa.value = ativaAntes
    },
  }]
}

/** Ordem nova: salva sozinha, com Desfazer. Soltar no mesmo lugar nem chega aqui. */
function aoReordenar(anterior: Pasta[]) {
  if (estilo.value === 'hoje') return
  toast.add({ title: t.value.barra.ordemSalva, icon: 'i-lucide-check', color: 'success', duration: 4000, actions: desfazerCom(anterior) })
}

function ocultar(id: string) {
  const anterior = pastas.value
  const p = anterior.find(x => x.id === id)!
  const ativaAntes = ativa.value
  pastas.value = anterior.filter(x => x.id !== id)
  if (ativa.value === id) ativa.value = pastas.value[0]!.id
  toast.add({ title: t.value.dialogos.ocultada(nomeDe(p)), icon: 'i-lucide-eye-off', duration: 5000, actions: desfazerCom(anterior, ativaAntes) })
}

/* Editar e Nova: o mesmo modal com o campo Nome. */
const modalNome = ref<{ aberto: boolean, id: string | null, nome: string }>({ aberto: false, id: null, nome: '' })

function editar(id: string) {
  const p = pastas.value.find(x => x.id === id)!
  modalNome.value = { aberto: true, id, nome: nomeDe(p) }
}

function nova() {
  modalNome.value = { aberto: true, id: null, nome: '' }
}

function salvarNome() {
  const nome = modalNome.value.nome.trim() || t.value.dialogos.nomePadrao
  if (modalNome.value.id) {
    pastas.value = pastas.value.map(p => p.id === modalNome.value.id ? { ...p, nome } : p)
  }
  else {
    const id = `pasta-${Date.now()}`
    pastas.value = [...pastas.value, { id, nome, icone: 'i-lucide-folder', sistema: false, tipo: 'personalizada' }]
    ativa.value = id
    toast.add({ title: t.value.dialogos.criada(nome), icon: 'i-lucide-folder-plus', color: 'success', duration: 3000 })
  }
  modalNome.value.aberto = false
}

/* Excluir: confirmação. */
const aExcluir = ref<Pasta | null>(null)
const excluindo = ref(false)

function pedirExclusao(id: string) {
  aExcluir.value = pastas.value.find(x => x.id === id) ?? null
}

async function excluir() {
  if (!aExcluir.value) return
  excluindo.value = true
  await new Promise(r => setTimeout(r, 450))
  const p = aExcluir.value
  pastas.value = pastas.value.filter(x => x.id !== p.id)
  if (ativa.value === p.id) ativa.value = pastas.value[0]!.id
  toast.add({ title: t.value.dialogos.excluida(nomeDe(p)), icon: 'i-lucide-trash-2', duration: 3000 })
  excluindo.value = false
  aExcluir.value = null
}

/* ---------- casca ---------- */
const trilha = computed(() => onde.value === 'tela'
  ? [workspace.name, t.value.casca.categorias, categoria.slug, item.reference]
  : [workspace.name, t.value.casca.categorias, categoria.slug])

const estilos = computed(() => [
  { value: 'hoje' as const, label: t.value.andaime.estilos.hoje },
  { value: 'sublinhado' as const, label: t.value.andaime.estilos.sublinhado, recomendada: true },
  { value: 'navegador' as const, label: t.value.andaime.estilos.navegador },
])
</script>

<template>
  <div>
    <CascaDoItem :t="t" :trilha="trilha">
      <!-- TELA DO ITEM -->
      <div v-if="onde === 'tela'" class="flex h-[calc(100dvh-4rem)] min-h-0">
        <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" />
        <section class="flex min-w-0 flex-1 flex-col bg-default">
          <BarraDePastas
            v-model:pastas="pastas"
            v-model:ativa="ativa"
            :t="t"
            :estilo="estilo"
            @editar="editar"
            @ocultar="ocultar"
            @excluir="pedirExclusao"
            @nova="nova"
            @reordenada="aoReordenar"
          />
          <div class="min-h-0 flex-1 overflow-y-auto">
            <Transition
              mode="out-in"
              enter-active-class="transition duration-150 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              leave-active-class="transition duration-75 ease-in"
              leave-to-class="opacity-0"
            >
              <ConteudoDaPasta :key="pastaAtiva.id + estilo" :t="t" :pasta="pastaAtiva" :estilo="estilo" />
            </Transition>
          </div>
          <footer class="flex justify-end border-t border-default px-5 py-3">
            <UButton icon="i-lucide-save" :label="t.conteudo.salvar" size="sm" @click="toast.add({ title: t.conteudo.salvo, icon: 'i-lucide-check', color: 'success', duration: 2500 })" />
          </footer>
        </section>
      </div>

      <!-- BARRA LATERAL: a lista atrás, o item à direita -->
      <div v-else class="relative h-[calc(100dvh-4rem)] overflow-hidden">
        <div class="p-4 opacity-40" aria-hidden="true">
          <div class="mb-3 flex gap-2">
            <UBadge :label="categoria.name" icon="i-lucide-table" color="neutral" variant="soft" />
          </div>
          <div class="divide-y divide-default rounded-lg border border-default">
            <div v-for="l in linhas" :key="l.ref" class="flex items-center gap-6 px-4 py-3 text-sm">
              <span class="w-72 truncate font-mono text-xs text-info">{{ l.ref }}</span>
              <span class="flex-1 truncate">{{ l.fornecedor }}</span>
              <span class="w-28 text-right">{{ l.valor }}</span>
            </div>
          </div>
        </div>
        <Transition appear enter-active-class="transition duration-200 ease-out" enter-from-class="translate-x-6 opacity-0">
          <div class="absolute inset-y-0 right-0 flex w-[min(53.5rem,100%)] border-l border-default bg-default shadow-xl">
            <PainelDoItem v-model:recolhido="painelRecolhido" :t="t" />
            <section class="flex min-w-0 flex-1 flex-col">
              <BarraDePastas
                v-model:pastas="pastas"
                v-model:ativa="ativa"
                :t="t"
                :estilo="estilo"
                @editar="editar"
                @ocultar="ocultar"
                @excluir="pedirExclusao"
                @nova="nova"
                @reordenada="aoReordenar"
              />
              <div class="min-h-0 flex-1 overflow-y-auto">
                <Transition
                  mode="out-in"
                  enter-active-class="transition duration-150 ease-out"
                  enter-from-class="opacity-0 translate-y-1"
                  leave-active-class="transition duration-75 ease-in"
                  leave-to-class="opacity-0"
                >
                  <ConteudoDaPasta :key="pastaAtiva.id + estilo" :t="t" :pasta="pastaAtiva" :estilo="estilo" />
                </Transition>
              </div>
              <footer class="flex justify-end border-t border-default px-5 py-3">
                <UButton icon="i-lucide-save" :label="t.conteudo.salvar" size="sm" />
              </footer>
            </section>
          </div>
        </Transition>
      </div>
    </CascaDoItem>

    <!-- Editar e Nova folder -->
    <UModal
      v-model:open="modalNome.aberto"
      :title="modalNome.id ? t.dialogos.editarTitulo : t.dialogos.novaTitulo"
      :ui="{ content: 'max-w-sm' }"
    >
      <template #body>
        <form id="form-nome" @submit.prevent="salvarNome">
          <UFormField :label="t.dialogos.nome">
            <UInput v-model="modalNome.nome" :placeholder="t.dialogos.nomePadrao" class="w-full" autofocus />
          </UFormField>
        </form>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.dialogos.cancelar" color="neutral" variant="ghost" @click="modalNome.aberto = false" />
          <UButton :label="t.dialogos.salvar" type="submit" form="form-nome" />
        </div>
      </template>
    </UModal>

    <!-- Excluir -->
    <UModal
      :open="!!aExcluir"
      :title="aExcluir ? t.dialogos.excluirTitulo(nomeDe(aExcluir)) : ''"
      :description="t.dialogos.excluirTexto"
      :ui="{ content: 'max-w-md' }"
      @update:open="(v: boolean) => { if (!v) aExcluir = null }"
    >
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.dialogos.cancelar" color="neutral" variant="ghost" @click="aExcluir = null" />
          <UButton :label="t.dialogos.excluirBotao" color="error" :loading="excluindo" @click="excluir" />
        </div>
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2.5">
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.estilo }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="e in estilos"
            :key="e.value"
            :color="estilo === e.value ? 'primary' : 'neutral'"
            :variant="estilo === e.value ? 'solid' : 'outline'"
            @click="estilo = e.value"
          >
            {{ e.label }}
            <UBadge v-if="e.recomendada" :label="t.andaime.recomendada" size="sm" :color="estilo === e.value ? 'neutral' : 'primary'" variant="soft" />
          </UButton>
        </UFieldGroup>

        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.ondeAbre }}</span>
        <UFieldGroup size="xs">
          <UButton
            v-for="o in (['tela', 'lateral'] as const)"
            :key="o"
            :label="t.andaime.ondes[o]"
            :color="onde === o ? 'primary' : 'neutral'"
            :variant="onde === o ? 'solid' : 'outline'"
            @click="onde = o"
          />
        </UFieldGroup>

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">{{ t.andaime.porTras }}</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/pastas-do-item"
          />
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * O menu da documentação: hoje, proposta A (para leigo) e proposta B (espelho
 * do menu do ENSPACE).
 *
 * A demanda: os usuários se perdem na doc e não entendem os aninhamentos. As 2
 * propostas usam as MESMAS 242 páginas da documentação real (`paginas.ts`);
 * muda só onde cada uma fica e como a barra se comporta.
 *
 * O que é proposta: a barra (`_MenuDaDoc.vue`, desenhos A e B) e as 3 peças do
 * corpo marcadas no `_CorpoDaPagina.vue`. Todo o resto é casca do docs.enspace.io.
 *
 * Andaime (não é proposta): o alternador de menu, o "lado a lado", as tarefas
 * de teste com o contador de cliques, os estados e o endereço.
 *
 * 100% front-end. Nada de rede.
 */
import CascaDaDoc from './_CascaDaDoc.vue'
import CorpoDaPagina from './_CorpoDaPagina.vue'
import MenuDaDoc from './_MenuDaDoc.vue'
import {
  arvores, caminhoAte, cliquesMinimos, enderecoNo, lingua, menus, nomeDoNo,
  outrasPortas, paginaInicial, paginas, tarefas,
  type ChaveDeTarefa, type Menu,
} from './mocks'
import { textos } from './textos'

import briefingMd from './BRIEFING.md?raw'
import decisoesMd from './DECISOES.md?raw'
import pesquisaMd from './PESQUISA.md?raw'

definePageMeta({
  titulo: 'Menu da documentação',
  descricao: 'Duas propostas de menu para a doc, lado a lado com o de hoje, testadas por cliques.',
  status: 'em-revisao',
  atualizado: '2026-09-29',
  tela: 'docs.enspace.io, página de documentação',
})

const t = useTextos(textos)
const idioma = useIdioma()
const l = computed(() => lingua(idioma.value))
const toast = useToast()

/* ------------------------------ andaime ------------------------------ */
type Estado = 'cheio' | 'carregando' | 'erro'
const estados: Estado[] = ['cheio', 'carregando', 'erro']
const estado = ref<Estado>('cheio')
const ladoALado = ref(false)

/* ------------------------------ a tela ------------------------------ */
const menuEscolhido = ref<Menu>('a')
const paginaAtiva = ref(paginaInicial)
/** De qual menu a página atual foi aberta: é o desenho que o corpo segue. */
const menuDoCorpo = ref<Menu>('a')
/** Troca a chave para remontar uma barra fechada (começo de tarefa). */
const chaves = reactive<Record<Menu, number>>({ hoje: 0, a: 0, b: 0 })

const menusVisiveis = computed<Menu[]>(() => (ladoALado.value ? menus : [menuEscolhido.value]))

watch(menuEscolhido, (m) => {
  menuDoCorpo.value = m
  if (tarefa.value) recomecar([m])
})

watch(ladoALado, (lado) => {
  if (!lado) menuDoCorpo.value = menuEscolhido.value
  if (tarefa.value) recomecar()
})

/* ------------------------------ tarefa de teste ------------------------------ */
const tarefa = ref<ChaveDeTarefa | null>(null)
const cliques = reactive<Record<Menu, number>>({ hoje: 0, a: 0, b: 0 })
const achou = reactive<Record<Menu, number | null>>({ hoje: null, a: null, b: null })
const alvo = computed(() => tarefas.find(x => x.chave === tarefa.value)?.alvo ?? null)

function recomecar(quais: Menu[] = menus) {
  for (const m of quais) {
    cliques[m] = 0
    achou[m] = null
    chaves[m]++
  }
  paginaAtiva.value = paginaInicial
}

watch(tarefa, () => recomecar())

function proximaTarefa() {
  const i = tarefas.findIndex(x => x.chave === tarefa.value)
  tarefa.value = tarefas[(i + 1) % tarefas.length]!.chave
}

function contarClique(m: Menu) {
  if (tarefa.value && achou[m] === null) cliques[m]++
}

function abrir(m: Menu, id: string, contar = false) {
  if (contar) contarClique(m)
  paginaAtiva.value = id
  menuDoCorpo.value = m
  if (tarefa.value && id === alvo.value && achou[m] === null) {
    achou[m] = cliques[m]
    toast.add({
      title: `${t.value.menus[m]}: ${t.value.teste.achou(cliques[m])}`,
      description: t.value.teste.caminhoMaisCurto(cliquesMinimos(m, id)),
      icon: 'i-lucide-circle-check',
      color: 'success',
    })
  }
}

/** Na tarefa lado a lado, cada barra só abre sozinha com o que foi aberto nela. */
function segue(m: Menu) {
  if (m === 'hoje') return false
  if (ladoALado.value && tarefa.value) return menuDoCorpo.value === m
  return true
}

/* ------------------------------ o corpo ------------------------------ */
const pagina = computed(() => paginas.get(paginaAtiva.value)!)
const caminho = computed(() => caminhoAte(arvores[menuDoCorpo.value], paginaAtiva.value))
const noAtual = computed(() => caminho.value.at(-1))

const titulo = computed(() =>
  menuDoCorpo.value === 'hoje' || !noAtual.value ? pagina.value.titulo[l.value] : nomeDoNo(noAtual.value, l.value))

const trilha = computed(() =>
  caminho.value.map(no => ({ nome: nomeDoNo(no, l.value), pagina: no.pagina })))

const outras = computed(() =>
  outrasPortas(paginaAtiva.value).map(id => ({
    id,
    caminho: caminhoAte(arvores[menuDoCorpo.value], id).map(no => nomeDoNo(no, l.value)).join(' › '),
  })))

const filhos = computed(() =>
  (noAtual.value?.tipo === 'pasta' ? noAtual.value.filhos ?? [] : []).map(no => ({
    no,
    nome: nomeDoNo(no, l.value),
    descricao: no.pagina ? paginas.get(no.pagina)?.descricao[l.value] ?? '' : '',
  })))

/* ------------------------------ "Nesta página" ------------------------------ */
const sumario = computed(() => pagina.value.secoes[l.value].map((texto, i) => ({ id: `secao-${i}`, texto })))
const tituloAtivo = ref('')
let observador: IntersectionObserver | null = null

async function observarTitulos() {
  if (!observador) return
  observador.disconnect()
  await nextTick()
  const alvos = sumario.value.map(s => document.getElementById(s.id)).filter((e): e is HTMLElement => !!e)
  alvos.forEach(a => observador!.observe(a))
  tituloAtivo.value = alvos[0]?.id ?? ''
}

onMounted(() => {
  observador = new IntersectionObserver(
    (entradas) => {
      const visivel = entradas.filter(e => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visivel) tituloAtivo.value = visivel.target.id
    },
    { rootMargin: '-120px 0px -70% 0px' },
  )
  watch(sumario, observarTitulos, { immediate: true })
})
onBeforeUnmount(() => observador?.disconnect())

function irPara(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

watch(paginaAtiva, () => {
  if (import.meta.client) window.scrollTo({ top: 0, behavior: 'smooth' })
})

const itensDeTarefa = computed(() => [
  { label: t.value.andaime.semTarefa, value: 'nenhuma' },
  ...tarefas.map(x => ({ label: t.value.tarefas[x.chave], value: x.chave })),
])
const tarefaEscolhida = computed({
  get: () => tarefa.value ?? 'nenhuma',
  set: (v: string) => { tarefa.value = v === 'nenhuma' ? null : v as ChaveDeTarefa },
})
</script>

<template>
  <CascaDaDoc :t="t" :lado-a-lado="ladoALado">
    <!-- ✅ A PROPOSTA: a barra (1 ou as 3, lado a lado) -->
    <template #menu>
      <div :class="ladoALado ? 'grid grid-cols-3 gap-6' : ''">
        <div v-for="m in menusVisiveis" :key="m" class="min-w-0">
          <!-- Andaime: no lado a lado, o nome de cada barra e o contador -->
          <div v-if="ladoALado" class="mb-4 flex min-h-12 flex-col gap-1 border-b border-default pb-3">
            <span class="text-sm font-semibold text-highlighted">{{ t.menus[m] }}</span>
            <span class="text-xs text-muted">{{ t.resumos[m] }}</span>
            <span v-if="tarefa" class="mt-1 self-start">
              <UBadge
                :label="achou[m] !== null ? t.teste.achou(achou[m]!) : t.teste.cliques(cliques[m])"
                :color="achou[m] !== null ? 'success' : 'neutral'"
                :icon="achou[m] !== null ? 'i-lucide-circle-check' : 'i-lucide-mouse-pointer-click'"
                variant="subtle"
                size="sm"
              />
            </span>
          </div>

          <MenuDaDoc
            :key="`${m}-${chaves[m]}`"
            :menu="m"
            :arvore="arvores[m]"
            :pagina-ativa="paginaAtiva"
            :t="t"
            :l="l"
            :seguir-pagina="segue(m)"
            :carregando="estado === 'carregando'"
            :erro="estado === 'erro'"
            @abrir="id => abrir(m, id)"
            @clique="contarClique(m)"
            @recarregar="estado = 'cheio'"
          />
        </div>
      </div>
    </template>

    <template #menu-celular="{ fechar }">
      <MenuDaDoc
        :key="`celular-${menuEscolhido}-${chaves[menuEscolhido]}`"
        :menu="menuEscolhido"
        :arvore="arvores[menuEscolhido]"
        :pagina-ativa="paginaAtiva"
        :t="t"
        :l="l"
        :seguir-pagina="menuEscolhido !== 'hoje'"
        :carregando="estado === 'carregando'"
        :erro="estado === 'erro'"
        @abrir="id => { abrir(menuEscolhido, id); fechar() }"
        @clique="contarClique(menuEscolhido)"
        @recarregar="estado = 'cheio'"
      />
    </template>

    <template #sumario>
      <nav v-if="sumario.length" :aria-label="t.casca.nestaPagina">
        <p class="mb-3 text-sm font-semibold text-highlighted">{{ t.casca.nestaPagina }}</p>
        <ul class="flex flex-col border-l border-default">
          <li v-for="item in sumario" :key="item.id">
            <button
              type="button"
              class="-ml-px block w-full cursor-pointer border-l-2 py-1.5 pl-3 text-left text-sm transition-colors"
              :class="tituloAtivo === item.id ? 'border-primary font-medium text-primary' : 'border-transparent text-muted hover:text-highlighted'"
              @click="irPara(item.id)"
            >
              {{ item.texto }}
            </button>
          </li>
        </ul>
      </nav>
    </template>

    <div class="min-w-0">
      <!-- Andaime: a tarefa de teste -->
      <Transition
        enter-active-class="transition duration-300 ease-out"
        enter-from-class="-translate-y-2 opacity-0"
        leave-active-class="transition duration-150"
        leave-to-class="-translate-y-2 opacity-0"
      >
        <div
          v-if="tarefa"
          class="sticky top-[calc(var(--ui-header-height)+31px)] z-30 mt-6 rounded-xl border border-primary/30 bg-default/95 px-4 py-3 shadow-sm backdrop-blur lg:mt-10"
          role="status"
        >
          <div class="flex flex-wrap items-start gap-x-4 gap-y-2">
            <div class="min-w-0 flex-1">
              <p class="text-xs font-semibold uppercase tracking-wider text-primary">{{ t.teste.ache }}</p>
              <p class="text-base font-semibold text-highlighted">{{ t.tarefas[tarefa] }}</p>
            </div>
            <div class="flex items-center gap-1">
              <UButton :label="t.teste.recomecar" size="xs" color="neutral" variant="ghost" icon="i-lucide-rotate-ccw" class="cursor-pointer" @click="recomecar()" />
              <UButton :label="t.teste.proxima" size="xs" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right" class="cursor-pointer" @click="proximaTarefa" />
              <UButton size="xs" color="neutral" variant="ghost" icon="i-lucide-x" class="cursor-pointer" :aria-label="t.teste.fechar" @click="tarefa = null" />
            </div>
          </div>
          <ul class="mt-2 flex flex-wrap gap-2">
            <li v-for="m in menusVisiveis" :key="m">
              <UBadge
                :color="achou[m] !== null ? 'success' : 'neutral'"
                variant="subtle"
                size="md"
                :icon="achou[m] !== null ? 'i-lucide-circle-check' : 'i-lucide-search'"
              >
                <span class="font-semibold">{{ t.menus[m] }}</span>
                <span>· {{ achou[m] !== null ? t.teste.achou(achou[m]!) : `${t.teste.procurando} (${t.teste.cliques(cliques[m])})` }}</span>
                <span class="text-muted">· {{ t.teste.caminhoMaisCurto(cliquesMinimos(m, alvo!)) }}</span>
              </UBadge>
            </li>
          </ul>
        </div>
      </Transition>

      <div :key="`${menuDoCorpo}-${paginaAtiva}`" style="animation: entrada 260ms ease-out both">
        <CorpoDaPagina
          :t="t"
          :l="l"
          :menu="menuDoCorpo"
          :pagina="pagina"
          :titulo="titulo"
          :trilha="trilha"
          :outras="outras"
          :filhos="filhos"
          @abrir="id => abrir(menuDoCorpo, id, true)"
        />
      </div>
    </div>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <template #andaime>
      <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 py-2.5">
          <span class="flex flex-wrap items-center gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.menu }}</span>
            <UButton
              v-for="m in menus"
              :key="m"
              :label="t.menus[m]"
              size="xs"
              class="cursor-pointer transition-transform hover:-translate-y-0.5"
              :color="!ladoALado && menuEscolhido === m ? 'primary' : 'neutral'"
              :variant="!ladoALado && menuEscolhido === m ? 'solid' : 'subtle'"
              :disabled="ladoALado"
              @click="menuEscolhido = m"
            />
            <USwitch v-model="ladoALado" :label="t.andaime.ladoALado" size="sm" class="ml-1 hidden lg:flex" />
          </span>

          <span class="flex items-center gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.tarefa }}</span>
            <USelect v-model="tarefaEscolhida" :items="itensDeTarefa" size="xs" class="w-64" :aria-label="t.andaime.tarefa" />
          </span>

          <span class="flex items-center gap-1.5">
            <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.estado }}</span>
            <UButton
              v-for="e in estados"
              :key="e"
              :label="t.andaime.estados[e]"
              size="xs"
              class="cursor-pointer"
              :color="estado === e ? 'primary' : 'neutral'"
              :variant="estado === e ? 'solid' : 'subtle'"
              @click="estado = e"
            />
          </span>

          <span class="hidden items-center gap-1.5 2xl:flex">
            <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.endereco }}</span>
            <code class="rounded bg-accented px-2 py-1 text-xs text-toned">{{ enderecoNo(menuDoCorpo, paginaAtiva) }}</code>
          </span>

          <ControlesDePrototipo class="ml-auto" />

          <span class="flex items-center gap-2">
            <span class="text-xs font-semibold uppercase tracking-wider text-toned">{{ t.andaime.porTras }}</span>
            <PainelDeContexto
              :briefing="briefingMd"
              :pesquisa="pesquisaMd"
              :decisoes="decisoesMd"
              repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/menu-da-doc"
            />
          </span>
        </div>
      </div>
    </template>
  </CascaDaDoc>
</template>

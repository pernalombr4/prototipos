<script setup lang="ts">
import CascaDeAcesso from './_CascaDeAcesso.vue'
import MatrizFixa from './_MatrizFixa.vue'
import MatrizDeCategorias from './_MatrizDeCategorias.vue'
import DetalheDaCategoria from './_DetalheDaCategoria.vue'

import { type CategoriaMock, type Cenario, acoes, cargo, configuracoes, padrao, workspace } from './mocks'
import {
  caixasNaArvoreDeHoje,
  categoriasDoCenario,
  clonar,
  estadoInicial,
  mudancas,
  permissoesAtivas,
  pixelsPorLinhaHoje,
  totalDePermissoes,
} from './estado'
import { textos } from './textos'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Permissões de cargos',
  descricao: 'A tela do cargo que cresce com o workspace: padrão para todas as categorias, uma linha por categoria e campos e formulários em Ajustar.',
  status: 'em-revisao',
  atualizado: '2026-10-08',
  tela: 'Gestão de Membros › Cargo › Permissões',
})

const t = useTextos(textos)
const toast = useToast()

/* ------------------------------------------------------------------ *
 * Andaime: volume do workspace e estado da tela.
 * ------------------------------------------------------------------ */

const cenario = ref<Cenario>('grande')
type EstadoDaTela = 'normal' | 'carregando' | 'semPermissao' | 'erroAoSalvar'
const estadoDaTela = ref<EstadoDaTela>('normal')

const cenarios: { valor: Cenario, rotulo: string }[] = [
  { valor: 'develop', rotulo: '2 categorias (develop)' },
  { valor: 'medio', rotulo: '40 categorias' },
  { valor: 'grande', rotulo: '120 categorias' },
  { valor: 'vazio', rotulo: 'Sem categorias' },
]
const estadosDaTela: { valor: EstadoDaTela, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Normal' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'semPermissao', rotulo: 'Sem permissão para editar' },
  { valor: 'erroAoSalvar', rotulo: 'Erro ao salvar' },
]

const lista = computed(() => categoriasDoCenario(cenario.value))
const estado = ref(estadoInicial(lista.value))
const salvo = ref(clonar(estado.value))

watch(cenario, () => {
  estado.value = estadoInicial(lista.value)
  salvo.value = clonar(estado.value)
})

const somenteLeitura = computed(() => estadoDaTela.value === 'semPermissao')
const carregando = computed(() => estadoDaTela.value === 'carregando')

/* ------------------------------------------------------------------ *
 * Contagens do cabeçalho (as mesmas que o develop mostra hoje).
 * ------------------------------------------------------------------ */

const total = computed(() => totalDePermissoes(lista.value))
const ativas = computed(() => permissoesAtivas(estado.value, lista.value))

const chavesDe = (grupos: typeof padrao) =>
  grupos.flatMap(g => g.linhas.flatMap(l => [...l.acoes.map(a => `${l.chave}:${a}`), ...(l.outras ?? []).map(o => `${l.chave}:${o}`)]))

const contagemConfig = computed(() => {
  const chaves = chavesDe(configuracoes)
  return { n: chaves.filter(c => estado.value.fixas.includes(c)).length, total: chaves.length }
})
/** Dados = tudo menos Configurações (Padrão + categorias + formulários). */
const contagemDados = computed(() => ({
  n: ativas.value - contagemConfig.value.n,
  total: total.value - contagemConfig.value.total,
}))

const listaDeMudancas = computed(() =>
  mudancas(salvo.value, estado.value, lista.value, [...padrao, ...configuracoes], c => t.value.linhas[c] ?? c),
)
const pendentes = computed(() => listaDeMudancas.value.length)

/* ------------------------------------------------------------------ *
 * Abas, camada da categoria e confirmação.
 * ------------------------------------------------------------------ */

const aba = ref<'dados' | 'configuracoes' | 'invalidas'>('dados')
const itensDeAba = computed(() => [
  { label: t.value.abas.dados, value: 'dados', icon: 'i-lucide-database', badge: { label: `${contagemDados.value.n}/${contagemDados.value.total}`, color: 'neutral' as const, variant: 'subtle' as const } },
  { label: t.value.abas.configuracoes, value: 'configuracoes', icon: 'i-lucide-settings', badge: { label: `${contagemConfig.value.n}/${contagemConfig.value.total}`, color: 'neutral' as const, variant: 'subtle' as const } },
  { label: t.value.abas.invalidas, value: 'invalidas', icon: 'i-lucide-shield' },
])

const categoriaAberta = ref<CategoriaMock | null>(null)
const detalheAberto = ref(false)
function ajustar(c: CategoriaMock) {
  categoriaAberta.value = c
  detalheAberto.value = true
}

const confirmando = ref(false)
const salvando = ref(false)

function listaDeAcoes(valor: string | number | undefined) {
  const nomes = String(valor ?? '').split(',').filter(Boolean).map(a => t.value.acoes[a as typeof acoes[number]] ?? t.value.outras[a] ?? a)
  return new Intl.ListFormat(t.value.locale, { type: 'conjunction' }).format(nomes)
}

function frase(p: { chave: string, valor?: string | number }) {
  const ps = t.value.partes
  switch (p.chave) {
    case 'liberou': return ps.liberou(listaDeAcoes(p.valor))
    case 'tirou': return ps.tirou(listaDeAcoes(p.valor))
    case 'ganhouRegra': return ps.ganhouRegra
    case 'voltouAoPadrao': return ps.voltouAoPadrao
    case 'segueOPadrao': return ps.segueOPadrao(Number(p.valor))
    case 'camposEscolhidos': return ps.camposEscolhidos(Number(p.valor))
    case 'todosOsCampos': return ps.todosOsCampos
    case 'formularios': return ps.formularios(Number(p.valor))
    default: return p.chave
  }
}

function salvar() {
  salvando.value = true
  setTimeout(() => {
    salvando.value = false
    confirmando.value = false
    if (estadoDaTela.value === 'erroAoSalvar') {
      toast.add({ title: t.value.toastErro, description: t.value.toastErroDesc, color: 'error', icon: 'i-lucide-circle-x' })
      return
    }
    salvo.value = clonar(estado.value)
    toast.add({ title: t.value.toastSalvo, description: t.value.toastSalvoDesc, color: 'success', icon: 'i-lucide-circle-check' })
  }, 900)
}

function descartar() {
  estado.value = clonar(salvo.value)
  toast.add({ title: t.value.toastDescartado, color: 'neutral', icon: 'i-lucide-rotate-ccw', duration: 2500 })
}

/* ------------------------------------------------------------------ *
 * A régua do andaime: hoje x proposta, no volume escolhido.
 * ------------------------------------------------------------------ */

const caixasHoje = computed(() => caixasNaArvoreDeHoje(lista.value))
const pxHoje = computed(() => caixasHoje.value * pixelsPorLinhaHoje)
const linhasProposta = computed(() => padrao[0]!.linhas.length + 1 + lista.value.length)
const fmt = (n: number) => n.toLocaleString('pt-BR')
</script>

<template>
  <CascaDeAcesso :t="t" :workspace="workspace.nome" :slug="workspace.slug" :id-cargo="cargo.id">
    <div class="min-h-0 flex-1 overflow-y-auto px-6 pb-36 pt-5">
      <!-- Cabeçalho do cargo (como é hoje) -->
      <div class="flex items-center gap-3">
        <span class="flex size-10 items-center justify-center rounded-lg bg-elevated text-highlighted">
          <UIcon :name="cargo.icon ?? 'i-lucide-id-card'" class="size-5" />
        </span>
        <h1 class="text-2xl font-semibold text-highlighted">{{ t.cargo }} {{ cargo.name }}</h1>
      </div>

      <div class="mt-6 grid grid-cols-2 gap-6">
        <div>
          <p class="flex items-center gap-2 text-sm font-medium text-default">
            <UIcon name="i-lucide-circle-check" class="size-4 text-success" />
            {{ t.permissoesAtivas }}
          </p>
          <p class="mt-2 text-2xl text-highlighted">
            <USkeleton v-if="carregando" class="h-7 w-20" />
            <template v-else>{{ ativas }} <span class="text-sm text-muted">/ {{ total }}</span></template>
          </p>
        </div>
        <div>
          <p class="flex items-center gap-2 text-sm font-medium text-default">
            <UIcon :name="pendentes ? 'i-lucide-clock' : 'i-lucide-check'" class="size-4" :class="pendentes ? 'text-warning' : 'text-success'" />
            {{ t.mudancasPendentes }}
          </p>
          <p class="mt-2 text-2xl text-highlighted">{{ pendentes }}</p>
        </div>
      </div>

      <!-- Sem permissão para editar -->
      <UAlert
        v-if="somenteLeitura"
        class="mt-5"
        icon="i-lucide-lock"
        color="neutral"
        variant="subtle"
        :title="t.semPermissaoTitulo"
        :description="t.semPermissaoDesc"
      />

      <!-- Alterações pendentes: o Salvar continua no topo, como hoje. -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="-translate-y-1 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="-translate-y-1 opacity-0"
      >
        <div v-if="pendentes && !somenteLeitura" class="sticky top-0 z-20 -mx-6 mt-3 bg-default px-6 py-2">
        <UAlert
          class="shadow-sm"
          icon="i-lucide-circle-alert"
          color="warning"
          variant="subtle"
          :title="t.alertaTitulo"
          :description="t.alertaTexto(pendentes)"
          orientation="horizontal"
          :actions="[
            { label: t.descartar, color: 'neutral', variant: 'ghost', onClick: descartar },
            { label: t.salvar, color: 'primary', onClick: () => { confirmando = true } },
          ]"
        />
        </div>
      </Transition>

      <UTabs v-model="aba" :items="itensDeAba" :content="false" variant="link" class="mt-6" />

      <div class="pt-5">
        <!-- DADOS -->
        <div v-if="aba === 'dados'" class="space-y-8">
          <section class="space-y-3">
            <header>
              <h3 class="text-sm font-semibold text-highlighted">{{ t.padrao }}</h3>
              <p class="text-sm text-muted">{{ t.padraoDesc }}</p>
            </header>
            <MatrizFixa :t="t" :grupos="padrao" :estado="estado" :salvo="salvo" :somente-leitura="somenteLeitura" />
          </section>

          <MatrizDeCategorias
            :t="t"
            :lista="lista"
            :estado="estado"
            :salvo="salvo"
            :somente-leitura="somenteLeitura"
            :carregando="carregando"
            @ajustar="ajustar"
          />
        </div>

        <!-- CONFIGURAÇÕES -->
        <div v-else-if="aba === 'configuracoes'" class="space-y-4">
          <p class="text-sm text-muted">{{ t.configuracoesDesc }}</p>
          <MatrizFixa :t="t" :grupos="configuracoes" :estado="estado" :salvo="salvo" :somente-leitura="somenteLeitura" com-titulo />
        </div>

        <!-- INVÁLIDAS (como é hoje) -->
        <div v-else class="space-y-4">
          <p class="text-sm text-muted">{{ t.invalidasDesc }}</p>
          <UEmpty icon="i-lucide-shield-check" :description="t.invalidasVazio" variant="naked" />
        </div>
      </div>
    </div>

    <DetalheDaCategoria
      v-model:open="detalheAberto"
      :t="t"
      :categoria="categoriaAberta"
      :estado="estado"
      :somente-leitura="somenteLeitura"
    />

    <!-- Confirmação: diz o que muda, em palavras, e quem sente. -->
    <UModal v-model:open="confirmando" :title="t.confirmarTitulo(pendentes)" :description="t.confirmarImpacto(cargo.pessoas)">
      <template #body>
        <ul class="max-h-80 space-y-2 overflow-y-auto">
          <li v-for="(m, i) in listaDeMudancas" :key="i" class="flex items-start gap-2 text-sm">
            <UIcon name="i-lucide-dot" class="mt-0.5 size-4 shrink-0 text-muted" />
            <span class="text-default">
              <strong class="font-medium text-highlighted">{{ m.onde === '__padrao__' ? t.padraoNome : m.onde }}</strong>{{ `: ${m.partes.map(frase).join('; ')}` }}
            </span>
          </li>
        </ul>
      </template>
      <template #footer>
        <div class="flex w-full justify-end gap-2">
          <UButton :label="t.cancelar" color="neutral" variant="ghost" @click="confirmando = false" />
          <UButton :label="t.confirmar" :loading="salvando" @click="salvar" />
        </div>
      </template>
    </UModal>

    <!-- ANDAIME DE PROTÓTIPO, não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <div class="flex flex-wrap items-center gap-2 px-4 py-2">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">Volume</span>
        <UButton
          v-for="c in cenarios"
          :key="c.valor"
          :label="c.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="cenario === c.valor ? 'primary' : 'neutral'"
          :variant="cenario === c.valor ? 'solid' : 'subtle'"
          @click="cenario = c.valor"
        />
        <span class="mx-1 h-5 w-px bg-accented" aria-hidden="true" />
        <span class="text-xs font-semibold uppercase tracking-wider text-muted">Estado</span>
        <UButton
          v-for="e in estadosDaTela"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estadoDaTela === e.valor ? 'primary' : 'neutral'"
          :variant="estadoDaTela === e.valor ? 'solid' : 'subtle'"
          @click="estadoDaTela = e.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">Por trás</span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/permissoes-de-cargos"
          />
        </span>
      </div>
      <p class="border-t border-default px-4 py-1.5 text-xs text-muted">
        <UIcon name="i-lucide-ruler" class="mr-1 inline size-3.5 align-[-2px]" />
        Neste volume, a aba Dados de hoje teria <strong class="text-highlighted">{{ fmt(caixasHoje) }} caixas</strong>
        com a árvore aberta (cerca de {{ fmt(pxHoje) }} px de rolagem). A proposta mostra
        <strong class="text-highlighted">{{ fmt(linhasProposta) }} linhas</strong> de 4 caixas; campo e formulário só em Ajustar.
      </p>
    </div>
  </CascaDeAcesso>
</template>

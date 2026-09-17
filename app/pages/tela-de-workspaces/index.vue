<script setup lang="ts">
import {
  workspaces,
  workspaceUnico,
  usuario,
  corDoPapel,
  type Workspace,
} from './mocks'
import { textos } from './textos'
import { type EnTableColumn } from '@be-enlighten/enspace-sdk-ui/base'
import ModalCriarWorkspace from './_ModalCriarWorkspace.vue'

// O contexto do protótipo vem dos próprios .md desta pasta, como texto.
// Fonte única: editar o .md muda o painel, sem duplicar conteúdo.
import briefingMd from './BRIEFING.md?raw'
import pesquisaMd from './PESQUISA.md?raw'
import decisoesMd from './DECISOES.md?raw'

definePageMeta({
  titulo: 'Tela de entrada (Workspaces)',
  descricao: 'Fazer a pessoa entender que é uma tela de escolha, e não o lugar onde se abre chamado.',
  status: 'em-revisao',
  atualizado: '2026-09-16',
  tela: 'Proposta',
})

const toast = useToast()
const t = useTextos(textos)

/** Tempo relativo no idioma corrente. */
function tempoRelativo(minutos: number | null): string {
  if (minutos === null) return t.value.nuncaEntrou
  if (minutos < 60) return t.value.haMinutos(minutos)
  const horas = Math.round(minutos / 60)
  if (horas < 24) return t.value.haHoras(horas)
  const dias = Math.round(horas / 24)
  if (dias < 30) return t.value.haDias(dias)
  return t.value.haMeses(Math.round(dias / 30))
}

/* ------------------------------------------------------------------
   Andaime de protótipo: o seletor de estados do rodapé NÃO é parte da
   proposta. Existe para revisar os cinco estados sem back-end.
------------------------------------------------------------------ */
type Estado = 'normal' | 'unico' | 'carregando' | 'vazio' | 'erro'
const estado = ref<Estado>('normal')
const estados: { valor: Estado, rotulo: string }[] = [
  { valor: 'normal', rotulo: 'Vários workspaces' },
  { valor: 'unico', rotulo: 'Só um (caso do chamado)' },
  { valor: 'carregando', rotulo: 'Carregando' },
  { valor: 'vazio', rotulo: 'Nenhum' },
  { valor: 'erro', rotulo: 'Erro' },
]

const base = computed<Workspace[]>(() => {
  if (estado.value === 'unico') return workspaceUnico
  if (estado.value === 'vazio') return []
  return workspaces
})

/* ---------------------------- estado da tela ---------------------------- */
const busca = ref('')
const aba = ref('todos')
/** Card é o padrão do produto hoje. Lista é alternativa, nunca substituição. */
const visual = ref<'cards' | 'lista'>('cards')
const convitesRecusados = ref<number[]>([])
const convitesAceitos = ref<number[]>([])
const favoritados = ref<number[]>([])

const visiveis = computed(() => base.value.filter(w => !convitesRecusados.value.includes(w.id)))

const pendentes = computed(() =>
  visiveis.value.filter(w => w.convitePendente && !convitesAceitos.value.includes(w.id)))

const disponiveis = computed(() =>
  visiveis.value.filter(w => !w.convitePendente || convitesAceitos.value.includes(w.id)))

function ehFavorito(w: Workspace) {
  return favoritados.value.includes(w.id) ? !w.favorito : w.favorito
}

const ultimo = computed(() =>
  [...disponiveis.value]
    .filter(w => w.ultimoAcessoMin !== null)
    .sort((a, b) => (a.ultimoAcessoMin ?? 0) - (b.ultimoAcessoMin ?? 0))[0])

/** Convite ainda não respondido — o card entra na lista com outro corpo. */
function estaPendente(w: Workspace) {
  return !!w.convitePendente && !convitesAceitos.value.includes(w.id)
}

const listados = computed(() => {
  const termo = busca.value.trim().toLowerCase()
  // Os pendentes também aparecem aqui: o aviso do topo é atalho, não
  // substituto do card. É assim que o produto mostra hoje.
  let lista = visiveis.value.filter(w => w.id !== ultimo.value?.id)

  if (aba.value === 'favoritos') lista = lista.filter(w => ehFavorito(w))
  if (aba.value === 'recentes') lista = lista.filter(w => w.ultimoAcessoMin !== null)
  if (termo) {
    lista = lista.filter(w =>
      w.name.toLowerCase().includes(termo) || w.reference.includes(termo))
  }
  return lista.sort((a, b) => (a.ultimoAcessoMin ?? 9e9) - (b.ultimoAcessoMin ?? 9e9))
})

const abas = computed(() => [
  { label: t.value.todos(visiveis.value.length), value: 'todos' },
  { label: t.value.favoritos(disponiveis.value.filter(w => ehFavorito(w)).length), value: 'favoritos' },
  { label: t.value.recentes(disponiveis.value.filter(w => w.ultimoAcessoMin !== null).length), value: 'recentes' },
])

/* -------- identidade visual por workspace --------
   Cor derivada do nome, dentro da paleta da marca (main.css). Não é
   decoração: é o que faz reconhecer o espaço de relance, sem gastar
   uma linha de texto. Fora das cores semânticas de propósito — nenhuma
   delas significa erro, sucesso ou alerta. */
const paletaDeIdentidade = [
  'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
  'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400',
  'bg-purple-500/10 text-purple-600 dark:text-purple-400',
  'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  'bg-space-500/10 text-space-600 dark:text-space-300',
]

function corDoWorkspace(w: Workspace) {
  const soma = [...w.reference].reduce((acc, c) => acc + c.charCodeAt(0), 0)
  return paletaDeIdentidade[soma % paletaDeIdentidade.length]!
}

/* -------- visualização em lista: EnTable, o componente do produto -------- */
const colunasDaLista = computed<EnTableColumn[]>(() => [
  { key: 'name', label: t.value.colunaWorkspace },
  { key: 'description', label: t.value.colunaDescricao },
  { key: 'papel', label: t.value.colunaPapel },
  { key: 'ultimoAcessoMin', label: t.value.colunaUltimoAcesso, sortable: true },
  { key: 'acoes', label: '', align: 'right' },
])

/* ---------------------------- ações (maquete) ---------------------------- */
const entrando = ref<number | null>(null)

function entrar(w: Workspace) {
  entrando.value = w.id
  setTimeout(() => {
    entrando.value = null
    toast.add({
      title: t.value.entrandoEm(w.name),
      description: t.value.entrandoDescricao,
      icon: 'i-lucide-log-in',
      color: 'primary',
    })
  }, 650)
}

function alternarFavorito(w: Workspace) {
  const i = favoritados.value.indexOf(w.id)
  if (i === -1) favoritados.value.push(w.id)
  else favoritados.value.splice(i, 1)
}

function aceitar(w: Workspace) {
  convitesAceitos.value.push(w.id)
  toast.add({ title: t.value.conviteAceito(w.name), icon: 'i-lucide-check', color: 'success' })
}

function recusar(w: Workspace) {
  convitesRecusados.value.push(w.id)
  toast.add({ title: t.value.conviteRecusado(w.name), icon: 'i-lucide-x', color: 'neutral' })
}

function tentarDeNovo() {
  estado.value = 'carregando'
  setTimeout(() => (estado.value = 'normal'), 900)
}

/* ------------------- criação: mesma tela, em camada ------------------- */
const criando = ref(false)

function abrirCriacao() {
  criando.value = true
}

function workspaceCriado(nome: string) {
  toast.add({
    title: t.value.criadoTitulo(nome),
    description: t.value.criadoDescricao,
    icon: 'i-lucide-check',
    color: 'success',
  })
}
</script>

<template>
  <div class="min-h-screen bg-default pb-28">
    <header class="border-b border-default bg-elevated/50 backdrop-blur">
      <UContainer class="flex h-14 items-center justify-between">
        <span class="text-sm font-medium text-muted">ENSPACE</span>
        <div class="flex items-center gap-3">
          <UButton icon="i-lucide-life-buoy" :label="t.suporte" color="neutral" variant="ghost" size="sm" />
          <UAvatar :text="usuario.iniciais" size="sm" />
        </div>
      </UContainer>
    </header>

    <UContainer class="max-w-5xl py-10 sm:py-14">
      <!-- 1. A tela diz o que é — e o atalho de criar continua no topo ---- -->
      <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div class="animate-[entrada_0.4s_ease-out_both]">
          <p class="text-sm text-muted">
            {{ t.saudacao(usuario.nome.split(' ')[0]!) }}
          </p>
          <h1 class="mt-1 text-2xl font-bold tracking-tight text-highlighted sm:text-3xl">
            {{ t.titulo }}
          </h1>
          <p class="mt-2 max-w-2xl text-muted">
            {{ t.explicacaoAntes
            }}<strong class="text-highlighted">{{ t.explicacaoDestaque }}</strong>{{
              t.explicacaoDepois }}
          </p>

        </div>

        <!-- Atalho no topo, como sempre esteve. Secundário no peso, não no
             endereço: quem precisa, encontra onde já procurava. -->
        <UTooltip :text="t.criarTooltip">
          <UButton
            :label="t.criarWorkspace"
            icon="i-lucide-plus"
            color="neutral"
            variant="outline"
            class="shrink-0 animate-[entrada_0.4s_ease-out_both] transition-transform hover:-translate-y-0.5"
            @click="abrirCriacao"
          />
        </UTooltip>
      </div>

      <!-- Erro -->
      <UAlert
        v-if="estado === 'erro'"
        class="animate-[entrada_0.3s_ease-out_both]"
        icon="i-lucide-triangle-alert"
        color="error"
        variant="subtle"
        :title="t.erroTitulo"
        :description="t.erroDescricao"
        :ui="{ title: 'font-bold' }"
        :actions="[{ label: t.tentarDeNovo, color: 'error', variant: 'solid', onClick: tentarDeNovo }]"
      />

      <!-- Carregando -->
      <div v-else-if="estado === 'carregando'" class="space-y-4">
        <USkeleton class="h-28 w-full rounded-xl" />
        <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <USkeleton v-for="i in 6" :key="i" class="h-36 rounded-xl" />
        </div>
      </div>

      <template v-else>
        <!-- 2. Convite pendente vira ação -->
        <TransitionGroup
          enter-active-class="transition duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          leave-active-class="transition duration-200 ease-in absolute"
          leave-to-class="opacity-0 scale-95"
        >
          <UAlert
            v-for="convite in pendentes"
            :key="convite.id"
            class="mb-4"
            icon="i-lucide-mail-open"
            color="secondary"
            variant="subtle"
            :title="t.conviteTitulo(convite.convidadoPor!, convite.name)"
            :description="t.conviteDescricao"
            :ui="{ title: 'font-bold' }"
            :actions="[
              { label: t.aceitarConvite, color: 'secondary', variant: 'solid', onClick: () => aceitar(convite) },
              { label: t.recusar, color: 'neutral', variant: 'ghost', onClick: () => recusar(convite) },
            ]"
          />
        </TransitionGroup>

        <!-- 3. Continue de onde parou -->
        <section
          v-if="ultimo"
          class="mb-8 animate-[entrada_0.45s_ease-out_both] rounded-xl border border-default bg-elevated/40 p-5 transition-shadow hover:shadow-md sm:p-6"
          style="animation-delay: 80ms"
        >
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-muted">
            {{ estado === 'unico' ? t.seuWorkspace : t.continueDeOndeParou }}
          </p>
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="flex min-w-0 items-center gap-4">
              <div class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-transform duration-300 hover:scale-105">
                <UIcon :name="ultimo.icon" class="size-6 text-primary" />
              </div>
              <div class="min-w-0">
                <h2 class="truncate text-lg font-semibold text-highlighted">
                  {{ ultimo.name }}
                </h2>
                <p class="truncate text-sm text-muted">
                  {{ ultimo.description || tempoRelativo(ultimo.ultimoAcessoMin) }}
                </p>
              </div>
            </div>
            <UButton
              :label="t.entrarEm(ultimo.name)"
              icon="i-lucide-log-in"
              size="lg"
              :loading="entrando === ultimo.id"
              class="shrink-0 justify-center transition-transform hover:scale-[1.02]"
              @click="entrar(ultimo)"
            />
          </div>
        </section>

        <!-- 4. Filtros, busca e o alternador card / lista -->
        <section v-if="listados.length || busca">
          <div class="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <UTabs v-model="aba" :items="abas" :content="false" color="primary" variant="link" size="sm" />

            <div class="flex items-center gap-2">
              <UInput
                v-model="busca"
                icon="i-lucide-search"
                :placeholder="t.buscarWorkspace"
                size="sm"
                class="w-full sm:w-56"
              />
              <!-- Card é o padrão. Lista é opção — e a troca é visível. -->
              <div class="flex shrink-0 rounded-md border border-default p-0.5">
                <UButton
                  icon="i-lucide-layout-grid"
                  size="xs"
                  square
                  :color="visual === 'cards' ? 'primary' : 'neutral'"
                  :variant="visual === 'cards' ? 'soft' : 'ghost'"
                  :aria-label="t.verEmCards"
                  @click="visual = 'cards'"
                />
                <UButton
                  icon="i-lucide-list"
                  size="xs"
                  square
                  :color="visual === 'lista' ? 'primary' : 'neutral'"
                  :variant="visual === 'lista' ? 'soft' : 'ghost'"
                  :aria-label="t.verEmLista"
                  @click="visual = 'lista'"
                />
              </div>
            </div>
          </div>

          <!-- CARDS (padrão) -->
          <TransitionGroup
            v-if="visual === 'cards'"
            tag="div"
            class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            enter-active-class="transition duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-3"
            leave-active-class="transition duration-150 ease-in absolute"
            leave-to-class="opacity-0 scale-95"
            move-class="transition-transform duration-300"
          >
            <article
              v-for="(w, i) in listados"
              :key="w.id"
              class="group relative flex animate-[entrada_0.4s_ease-out_both] flex-col rounded-xl border bg-elevated/20 p-4 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg focus-within:-translate-y-1 focus-within:shadow-lg"
              :class="estaPendente(w)
                ? 'border-secondary/50 border-dashed hover:border-secondary hover:shadow-secondary/5'
                : 'border-default hover:border-primary/60 hover:shadow-primary/5 focus-within:border-primary'"
              :style="{ animationDelay: `${i * 55}ms` }"
            >
              <!-- topo: identidade à esquerda, metadado e favorito à direita -->
              <div class="relative z-10 flex items-start justify-between gap-2">
                <div
                  class="flex size-10 items-center justify-center rounded-lg transition-colors"
                  :class="estaPendente(w) ? 'bg-secondary/10' : corDoWorkspace(w)"
                >
                  <UIcon
                    :name="estaPendente(w) ? 'i-lucide-mail-open' : w.icon!"
                    class="size-5"
                  />
                </div>

                <div class="flex items-center gap-1.5">
                  <UBadge
                    v-if="estaPendente(w)"
                    :label="t.convitePendente"
                    color="secondary"
                    variant="subtle"
                    size="sm"
                  />
                  <UBadge
                    v-else
                    :label="t.papeis[w.papel]"
                    :color="corDoPapel[w.papel]"
                    variant="subtle"
                    size="sm"
                  />
                  <UButton
                    v-if="!estaPendente(w)"
                    icon="i-lucide-star"
                    size="xs"
                    square
                    variant="ghost"
                    :color="ehFavorito(w) ? 'warning' : 'neutral'"
                    :class="ehFavorito(w)
                      ? 'text-warning'
                      : 'text-muted transition-colors hover:text-warning'"
                    :aria-label="ehFavorito(w) ? t.removerDosFavoritos : t.adicionarAosFavoritos"
                    @click="alternarFavorito(w)"
                  />
                </div>
              </div>

              <!-- corpo: altura mínima para os cards da grade se alinharem -->
              <div class="mt-3 min-h-16">
                <h3 class="line-clamp-2 font-semibold text-highlighted">
                  <!-- O card inteiro é o alvo: este link se estica por cima dele
                       (after:inset-0). A estrela fica acima, com z-10. No produto
                       o href leva ao workspace; aqui o clique é interceptado. -->
                  <a
                    v-if="!estaPendente(w)"
                    :href="`/w/${w.reference}`"
                    class="outline-none after:absolute after:inset-0 after:rounded-xl focus-visible:after:ring-2 focus-visible:after:ring-primary"
                    @click.prevent="entrar(w)"
                  >{{ w.name }}</a>
                  <template v-else>{{ w.name }}</template>
                </h3>
                <!-- Sem descrição não vira linha dizendo "sem descrição": o
                     espaço vazio já conta isso, e a altura mínima segura a grade. -->
                <p
                  v-if="estaPendente(w) || w.description"
                  class="mt-1 line-clamp-2 text-sm text-muted"
                >
                  {{ estaPendente(w) ? t.conviteCurto(w.convidadoPor!) : w.description }}
                </p>
              </div>

              <!-- rodapé ancorado: meta à esquerda, a ação à direita -->
              <div class="mt-auto flex items-end justify-between gap-2 pt-4">
                <p class="text-xs text-muted">
                  <template v-if="estaPendente(w)">{{ t.aceiteParaEntrar }}</template>
                  <template v-else>
                    {{ t.pessoas(w.members_count ?? 0) }} · {{ tempoRelativo(w.ultimoAcessoMin) }}
                  </template>
                </p>

                <!-- Convite tem duas ações de peso igual: aqui botão é o certo -->
                <div v-if="estaPendente(w)" class="relative z-10 flex items-center gap-2">
                  <UButton :label="t.aceitar" size="sm" color="secondary" @click="aceitar(w)" />
                  <UButton :label="t.recusar" size="sm" color="neutral" variant="ghost" @click="recusar(w)" />
                </div>

                <!-- Uma ação principal: vira afordância dentro do próprio alvo -->
                <span
                  v-else
                  class="pointer-events-none flex shrink-0 items-center gap-1 text-sm font-medium transition-colors"
                  :class="entrando === w.id ? 'text-primary' : 'text-muted group-hover:text-primary'"
                >
                  {{ entrando === w.id ? t.entrandoEm('').trim() + '…' : t.entrar }}
                  <UIcon
                    :name="entrando === w.id ? 'i-lucide-loader-circle' : 'i-lucide-arrow-right'"
                    class="size-4 transition-transform duration-200"
                    :class="entrando === w.id ? 'animate-spin' : 'group-hover:translate-x-1'"
                  />
                </span>
              </div>
            </article>
          </TransitionGroup>

          <!-- LISTA (alternativa) — EnTable, a listagem padrão do ENSPACE.
               Componente do próprio produto (@be-enlighten/enspace-sdk-ui),
               em modo dumb: recebe linhas e colunas, navega por emit. -->
          <EnTable
            v-else
            :columns="colunasDaLista"
            :rows="listados"
            :empty-state="{
              icon: 'i-lucide-search-x',
              title: t.buscaVaziaTitulo(busca),
              description: t.buscaVaziaDescricao,
            }"
            class="animate-[entrada_0.3s_ease-out_both]"
            @row-click="(row: Workspace) => !estaPendente(row) && entrar(row)"
          >
            <template #cell-name="{ row }">
              <div class="flex min-w-0 items-center gap-3">
                <div
                  class="flex size-8 shrink-0 items-center justify-center rounded-md"
                  :class="estaPendente(row) ? 'bg-secondary/10' : 'bg-elevated'"
                >
                  <UIcon
                    :name="estaPendente(row) ? 'i-lucide-mail-open' : row.icon!"
                    class="size-4"
                    :class="estaPendente(row) ? 'text-secondary' : 'text-muted'"
                  />
                </div>
                <span class="truncate font-medium text-highlighted">{{ row.name }}</span>
                <UIcon
                  v-if="ehFavorito(row) && !estaPendente(row)"
                  name="i-lucide-star"
                  class="size-3.5 shrink-0 text-warning"
                />
                <UBadge
                  v-if="estaPendente(row)"
                  :label="t.convitePendente"
                  color="secondary"
                  variant="subtle"
                  size="sm"
                  class="shrink-0"
                />
              </div>
            </template>

            <template #cell-description="{ row }">
              <span class="text-muted">
                {{ estaPendente(row)
                  ? t.conviteCurto(row.convidadoPor!)
                  : (row.description || t.pessoas(row.members_count ?? 0)) }}
              </span>
            </template>

            <template #cell-papel="{ row }">
              <UBadge
                v-if="!estaPendente(row)"
                :label="t.papeis[row.papel]"
                :color="corDoPapel[row.papel]"
                variant="subtle"
                size="sm"
              />
            </template>

            <template #cell-ultimoAcessoMin="{ row }">
              <span class="text-muted">
                {{ estaPendente(row) ? t.aceiteParaEntrar : tempoRelativo(row.ultimoAcessoMin) }}
              </span>
            </template>

            <template #cell-acoes="{ row }">
              <div class="flex items-center justify-end gap-2">
                <template v-if="estaPendente(row)">
                  <UButton :label="t.aceitar" size="sm" color="secondary" @click.stop="aceitar(row)" />
                  <UButton :label="t.recusar" size="sm" color="neutral" variant="ghost" @click.stop="recusar(row)" />
                </template>
                <UButton
                  v-else
                  :label="t.entrar"
                  size="sm"
                  color="neutral"
                  variant="subtle"
                  :loading="entrando === row.id"
                  @click.stop="entrar(row)"
                />
              </div>
            </template>
          </EnTable>

          <UEmpty
            v-if="!listados.length && busca"
            class="animate-[entrada_0.3s_ease-out_both]"
            icon="i-lucide-search-x"
            :title="t.buscaVaziaTitulo(busca)"
            :description="t.buscaVaziaDescricao"
          />
        </section>

        <!-- Nenhum workspace -->
        <UEmpty
          v-if="estado === 'vazio' && !pendentes.length"
          class="animate-[entrada_0.3s_ease-out_both]"
          icon="i-lucide-door-closed"
          :title="t.semWorkspaceTitulo"
          :description="t.semWorkspaceDescricao"
          :actions="[{ label: t.criarUmWorkspace, color: 'primary', onClick: abrirCriacao }]"
        />
      </template>
    </UContainer>

    <!-- 5. Criação: mesma tela, em camada. -->
    <ModalCriarWorkspace v-model:open="criando" @criado="workspaceCriado" />

    <!-- ANDAIME DE PROTÓTIPO — não faz parte da proposta -->
    <div class="fixed inset-x-0 bottom-0 z-40 border-t border-default bg-elevated/95 backdrop-blur">
      <UContainer class="flex flex-wrap items-center gap-2 py-3">
        <span class="mr-1 text-xs font-semibold uppercase tracking-wider text-muted">
          Protótipo · estado
        </span>
        <UButton
          v-for="e in estados"
          :key="e.valor"
          :label="e.rotulo"
          size="xs"
          class="transition-transform hover:-translate-y-0.5"
          :color="estado === e.valor ? 'primary' : 'neutral'"
          :variant="estado === e.valor ? 'solid' : 'subtle'"
          @click="estado = e.valor"
        />

        <ControlesDePrototipo class="ml-auto" />

        <span class="flex flex-wrap items-center gap-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-muted">
            Por trás
          </span>
          <PainelDeContexto
            :briefing="briefingMd"
            :pesquisa="pesquisaMd"
            :decisoes="decisoesMd"
            repositorio="https://github.com/pernalombr4/prototipos/tree/main/app/pages/tela-de-workspaces"
          />
        </span>
      </UContainer>
    </div>
  </div>
</template>

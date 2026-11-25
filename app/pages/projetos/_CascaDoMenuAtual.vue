<script setup lang="ts">
/**
 * A CASCA: o menu lateral de hoje do develop. NADA AQUI É PROPOSTA DESTE PROTÓTIPO.
 *
 * Copiado em 2026-11-25 dos prints `evidencias/develop-menu-lateral-topo.png` e
 * `evidencias/develop-menu-lateral-fim.png` (workspace de exploração, 2026-11-25), com a estrutura do
 * template de `dashboards/_CascaDoEnspace.vue`:
 *   - o workspace com a referência e a seta, e "Buscar..." com Ctrl K;
 *   - Membro: Início, Spaceflows, Categorias, Tarefas (Painel com "Novo", Agendadas, Rápidas), Agenda,
 *     Relatórios, Knowledge (Knowledge Base);
 *   - Configurações: Visão Geral, Sistema, Estrutura (Categorias, Listas, Spaceflow), Gestão de Membros,
 *     Interface (Menus, Telas, Casos de Uso), E-mails (E-mails Enviados, Modelos de E-mail, Caixas de
 *     E-mail), Integrações (Apps, Credenciais, Webhooks), Agentes de IA, Logs;
 *   - Ajuda: Releases, Documentação;
 *   - o botão redondo de recolher na borda e a barra do topo (a mesma da casca do menu novo).
 * Resumido: a categoria dentro de Categorias não abre as visualizações dela, e os itens que não levam a
 * uma tela deste protótipo avisam que são maquete.
 *
 * O que este protótipo propõe entra pelos slots: a seção Projetos logo abaixo de Spaceflows
 * (`#projetos`) e o conteúdo de Categorias (`#categorias`). A redução do menu do convidado
 * (`convidado`) também é proposta, e o contorno tracejado mostra isso.
 */
import type { Textos } from './textos'
import { workspace } from './mocks'
import { useMarcaDeProposta } from './estado'

type Chave = keyof Textos['menuAtual']['itens']
interface Item { chave: Chave, icone: string, filhos?: { chave: Chave, icone: string, novo?: boolean }[], externo?: boolean }

const props = defineProps<{
  t: Textos
  breadcrumb: string[]
  /** Proposta: o convidado vê só Início, Projetos e Tarefas. */
  convidado: boolean
  podeConfigurar: boolean
  iniciais: string
  /** Item da casca que corresponde à tela aberta. */
  ativo: Chave | null
}>()
const emit = defineEmits<{ ir: [chave: Chave] }>()

const { marca } = useMarcaDeProposta()
const toast = useToast()
const modoDeCor = useColorMode()
const idioma = useIdioma()
const sigla = computed(() => ({ 'pt-BR': 'BR', en: 'EN', es: 'ES' })[idioma.value])

const membro = computed<Item[]>(() => {
  const tarefas: Item = {
    chave: 'tarefas',
    icone: 'i-lucide-file-check',
    filhos: [
      { chave: 'painel', icone: 'i-lucide-layout-dashboard', novo: true },
      { chave: 'agendadas', icone: 'i-lucide-calendar-range' },
      { chave: 'rapidas', icone: 'i-lucide-clipboard-check' },
    ],
  }
  if (props.convidado) return [{ chave: 'inicio', icone: 'i-lucide-house' }, tarefas]
  return [
    { chave: 'inicio', icone: 'i-lucide-house' },
    { chave: 'spaceflows', icone: 'i-lucide-workflow' },
    { chave: 'categorias', icone: 'i-lucide-layout-grid' },
    tarefas,
    { chave: 'agenda', icone: 'i-lucide-calendar-days' },
    { chave: 'relatorios', icone: 'i-lucide-file-down' },
    { chave: 'knowledge', icone: 'i-lucide-book-open-text', filhos: [{ chave: 'knowledgeBase', icone: 'i-lucide-book-open-text' }] },
  ]
})

const configuracoes: Item[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-database', filhos: [
    { chave: 'estruturaCategorias', icone: 'i-lucide-layout-grid' },
    { chave: 'listas', icone: 'i-lucide-list-checks' },
    { chave: 'spaceflow', icone: 'i-lucide-git-fork' },
  ] },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-compass', filhos: [
    { chave: 'menus', icone: 'i-lucide-menu' },
    { chave: 'telas', icone: 'i-lucide-monitor' },
    { chave: 'casosDeUso', icone: 'i-lucide-box' },
  ] },
  { chave: 'emails', icone: 'i-lucide-mails', filhos: [
    { chave: 'emailsEnviados', icone: 'i-lucide-mail' },
    { chave: 'modelosDeEmail', icone: 'i-lucide-file-text' },
    { chave: 'caixasDeEmail', icone: 'i-lucide-inbox' },
  ] },
  { chave: 'integracoes', icone: 'i-lucide-plug', filhos: [
    { chave: 'apps', icone: 'i-lucide-store' },
    { chave: 'credenciais', icone: 'i-lucide-key-round' },
    { chave: 'webhooks', icone: 'i-lucide-webhook' },
  ] },
  { chave: 'agentesDeIa', icone: 'i-lucide-cpu' },
  { chave: 'logs', icone: 'i-lucide-activity' },
]

const ajuda: Item[] = [
  { chave: 'releases', icone: 'i-lucide-copy' },
  { chave: 'documentacao', icone: 'i-lucide-file-text', externo: true },
]

const grupos = computed(() => [
  { titulo: props.t.menuAtual.membro, itens: membro.value },
  ...(props.podeConfigurar && !props.convidado ? [{ titulo: props.t.menuAtual.configuracoes, itens: configuracoes }] : []),
  { titulo: props.t.menuAtual.ajuda, itens: ajuda },
])

/** Como no develop: Categorias e Tarefas abertas; o resto fechado. */
const abertos = ref<Chave[]>(['categorias', 'tarefas'])
function alternar(chave: Chave) {
  abertos.value = abertos.value.includes(chave) ? abertos.value.filter(x => x !== chave) : [...abertos.value, chave]
}

/** Só Início e Painel de tarefas levam a telas deste protótipo. */
function clicar(item: Item | { chave: Chave }) {
  if ('filhos' in item && item.filhos) return alternar(item.chave)
  if (item.chave === 'categorias') return alternar(item.chave)
  if (item.chave === 'inicio' || item.chave === 'painel') return emit('ir', item.chave)
  toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
}

const recolhido = ref(false)

function alternarTema() {
  modoDeCor.preference = modoDeCor.value === 'dark' ? 'light' : 'dark'
}
function aviso() {
  toast.add({ title: props.t.casca.maquete, icon: 'i-lucide-info', color: 'neutral' })
}

const classeDoItem = (ativo: boolean) => [
  'flex w-full items-center gap-2.5 px-4 py-2 text-left transition-colors focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-primary',
  ativo ? 'bg-primary/10 font-medium text-primary' : 'text-toned hover:bg-elevated',
]
</script>

<template>
  <div class="flex h-dvh flex-col bg-elevated/30">
    <div class="flex min-h-0 flex-1 pb-20">
      <div class="flex min-h-0 w-full overflow-hidden bg-default">
        <!-- O MENU LATERAL DE HOJE, copiado do develop. -->
        <aside
          class="relative hidden shrink-0 flex-col border-r border-default bg-elevated/40 transition-[width] duration-200 ease-out md:flex"
          :class="recolhido ? 'w-14' : 'w-[16.5rem]'"
          :aria-label="t.casca.menuLateral"
        >
          <button type="button" class="flex items-center gap-2 px-3 py-3 text-left transition-colors hover:bg-elevated" :aria-label="t.casca.trocarWorkspace">
            <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{{ workspace.nome.slice(0, 2).toUpperCase() }}</span>
            <span v-if="!recolhido" class="min-w-0 flex-1">
              <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.nome }}</span>
              <span class="block truncate text-xs text-muted">{{ workspace.referencia }}</span>
            </span>
            <UIcon v-if="!recolhido" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
          </button>

          <button type="button" class="mx-2 mb-2 flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated" @click="aviso">
            <UIcon name="i-lucide-search" class="size-4 shrink-0 text-toned" />
            <template v-if="!recolhido">
              <span class="flex-1 text-sm text-toned">{{ t.casca.buscar }}</span>
              <UKbd value="ctrl" size="sm" />
              <UKbd value="K" size="sm" />
            </template>
          </button>

          <nav class="min-h-0 flex-1 overflow-y-auto pb-4" :aria-label="t.casca.menuLateral">
            <template v-for="(grupo, g) in grupos" :key="g">
              <p v-if="!recolhido" class="px-4 pb-1 pt-4 text-xs font-medium text-muted">{{ grupo.titulo }}</p>
              <div v-else class="mx-3 my-3 border-t border-default" />

              <template v-for="item in grupo.itens" :key="item.chave">
                <button
                  type="button"
                  :class="[classeDoItem(ativo === item.chave), convidado && g === 0 ? marca : '']"
                  :aria-current="ativo === item.chave ? 'page' : undefined"
                  :aria-expanded="item.filhos || item.chave === 'categorias' ? abertos.includes(item.chave) : undefined"
                  @click="clicar(item)"
                >
                  <UIcon :name="item.icone" class="size-4 shrink-0" />
                  <template v-if="!recolhido">
                    <span class="flex-1 truncate text-sm">{{ t.menuAtual.itens[item.chave] }}</span>
                    <UIcon v-if="item.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-muted" />
                    <UIcon
                      v-else-if="item.filhos || item.chave === 'categorias'"
                      :name="abertos.includes(item.chave) ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
                      class="size-4 shrink-0 text-muted"
                    />
                  </template>
                </button>

                <template v-if="!recolhido && abertos.includes(item.chave)">
                  <slot v-if="item.chave === 'categorias'" name="categorias" />
                  <button
                    v-for="filho in item.filhos"
                    :key="filho.chave"
                    type="button"
                    class="pl-10"
                    :class="classeDoItem(ativo === filho.chave)"
                    :aria-current="ativo === filho.chave ? 'page' : undefined"
                    @click="clicar(filho)"
                  >
                    <UIcon :name="filho.icone" class="size-4 shrink-0" />
                    <span class="flex-1 truncate text-sm">{{ t.menuAtual.itens[filho.chave] }}</span>
                    <UBadge v-if="filho.novo" :label="t.menuAtual.novo" color="neutral" variant="outline" size="sm" class="shrink-0" />
                  </button>
                </template>

                <!-- PROPOSTA: a seção Projetos entra logo abaixo de Spaceflows (para o convidado, abaixo de Início). -->
                <slot v-if="!recolhido && item.chave === (convidado ? 'inicio' : 'spaceflows')" name="projetos" />
              </template>
            </template>
          </nav>

          <button
            type="button"
            class="absolute -right-3 top-1/2 z-10 flex size-6 items-center justify-center rounded-full border border-default bg-default text-muted shadow-sm transition-colors hover:text-highlighted"
            :aria-label="recolhido ? t.menuAtual.abrirMenu : t.casca.recolherMenu"
            @click="recolhido = !recolhido"
          >
            <UIcon :name="recolhido ? 'i-lucide-chevron-right' : 'i-lucide-chevron-left'" class="size-3.5" />
          </button>
        </aside>

        <div class="flex min-w-0 flex-1 flex-col">
          <!-- A BARRA DO TOPO, a mesma da casca do menu novo. Nada aqui é proposta. -->
          <header class="flex h-12 shrink-0 items-center gap-1 border-b border-default bg-default px-2">
            <UTooltip :text="t.casca.menu">
              <UButton icon="i-lucide-panel-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.menu" @click="recolhido = !recolhido" />
            </UTooltip>
            <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
            <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
            <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
            <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.inicio" @click="emit('ir', 'inicio')" />

            <div class="mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
              <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
                <template v-for="(parte, i) in breadcrumb" :key="i">
                  <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
                  <span class="truncate" :class="i === breadcrumb.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
                </template>
              </nav>
              <span class="ml-auto hidden shrink-0 items-center gap-1 sm:flex">
                <UKbd value="ctrl" size="sm" />
                <UKbd value="B" size="sm" />
                <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" :aria-label="t.casca.favoritar" />
              </span>
            </div>

            <div class="flex shrink-0 items-center gap-1.5">
              <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">{{ sigla }}</span>
              <UButton :icon="modoDeCor.value === 'dark' ? 'i-lucide-moon' : 'i-lucide-sun'" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" @click="alternarTema" />
              <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" class="hidden sm:inline-flex" @click="aviso" />
              <UChip text="99+" color="error" size="3xl">
                <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.notificacoes" />
              </UChip>
              <UChip color="success" size="sm" inset>
                <UAvatar size="sm" :text="iniciais" :alt="t.casca.conta" />
              </UChip>
            </div>
          </header>

          <main class="min-h-0 flex-1 overflow-y-auto">
            <slot />
          </main>
        </div>
      </div>
    </div>
  </div>
</template>

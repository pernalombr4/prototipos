<script setup lang="ts">
/**
 * A casca do ENSPACE em volta do item, montada no `EnLayout` do SDK.
 *
 * ⚠️ NADA AQUI É PROPOSTA. Copiado olhando o develop em 11/11/2026
 * (`/workspaces/teste-ux/types/leve/<referência>`): menu lateral com Membro
 * (Início, Spaceflows, Categorias aberto, Tarefas, Agenda, a chave sem tradução
 * "menu.member.reports.label" e Knowledge), Configurações e Ajuda; barra do topo
 * com voltar, avançar, recarregar, início, trilha, Ctrl B, estrela, idioma,
 * tema, Suporte, sino 99+ e avatar. Os nomes das categorias são do mock.
 *
 * Com `ativo="tarefasRapidas"`, o menu fica como na página Tarefas › Rápidas
 * (`/workspaces/teste-ux/tasks/quick`, 11/11/2026): Categorias recolhido e
 * Tarefas aberto com Agendadas, Rápidas (ativo) e Painel.
 *
 * Rodada 4, proposta: o sino mostra as notificações de quem você é no andaime
 * (atribuído, reaberto, retorno enviado), com o número das não lidas no lugar
 * do "99+" e "Marcar todas como lidas". Clicar numa delas abre o apontamento.
 */
import type { Textos } from './textos'

const props = defineProps<{
  t: Textos
  trilha: string[]
  workspace: { name: string, reference: string }
  categoriasDoMenu: { nome: string, ativo?: boolean }[]
  ativo?: 'categorias' | 'tarefasRapidas'
  /** Proposta: as notificações de quem está no papel escolhido. */
  avisos?: { id: string, texto: string, quando: string, iniciais: string, lida: boolean }[]
}>()
const emit = defineEmits<{ abrirAviso: [id: string], marcarLidas: [] }>()
const naoLidas = computed(() => props.avisos?.filter(a => !a.lida).length ?? 0)
const sinoAberto = ref(false)
function abrirAviso(id: string) {
  sinoAberto.value = false
  emit('abrirAviso', id)
}

const aberto = computed(() => props.ativo === 'tarefasRapidas' ? 'tarefas' : 'categorias')
const filhosDeTarefas = computed(() => [
  { nome: props.t.tarefaRapida.pagina.agendadas, icone: 'i-lucide-calendar' },
  { nome: props.t.tarefaRapida.pagina.rapidas, icone: 'i-lucide-clipboard-check', ativo: true },
  { nome: props.t.tarefaRapida.pagina.painel, icone: 'i-lucide-calendar-range' },
])

interface Entrada { chave: string, icone: string, filhos?: boolean, externo?: boolean }

const membro: Entrada[] = [
  { chave: 'inicio', icone: 'i-lucide-house' },
  { chave: 'spaceflows', icone: 'i-lucide-workflow' },
  { chave: 'categorias', icone: 'i-lucide-layout-grid', filhos: true },
  { chave: 'tarefas', icone: 'i-lucide-file-text', filhos: true },
  { chave: 'agenda', icone: 'i-lucide-calendar-days' },
  { chave: 'relatorios', icone: 'i-lucide-file-down' },
  { chave: 'knowledge', icone: 'i-lucide-book-text', filhos: true },
]

const configuracoes: Entrada[] = [
  { chave: 'visaoGeral', icone: 'i-lucide-circle-gauge' },
  { chave: 'sistema', icone: 'i-lucide-settings' },
  { chave: 'estrutura', icone: 'i-lucide-database', filhos: true },
  { chave: 'gestaoDeMembros', icone: 'i-lucide-contact' },
  { chave: 'interface', icone: 'i-lucide-compass', filhos: true },
  { chave: 'emails', icone: 'i-lucide-mails', filhos: true },
  { chave: 'integracoes', icone: 'i-lucide-plug', filhos: true },
  { chave: 'agentesDeIa', icone: 'i-lucide-cpu' },
  { chave: 'logs', icone: 'i-lucide-activity' },
]

const ajuda: Entrada[] = [
  { chave: 'releases', icone: 'i-lucide-package' },
  { chave: 'documentacao', icone: 'i-lucide-book-open', externo: true },
]
</script>

<template>
  <EnLayout variant="default" collapsible="icon" class="[&>.peer]:[--sidebar-width:12.5rem]">
    <template #sidebar-header="{ state }">
      <button type="button" class="-mx-2 flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
        <span class="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-white">
          <UIcon name="i-lucide-tree-deciduous" class="size-4" />
        </span>
        <span v-if="state === 'expanded'" class="min-w-0 flex-1">
          <span class="block truncate text-sm font-semibold text-highlighted">{{ workspace.name }}</span>
          <span class="block truncate text-xs text-muted">{{ workspace.reference }}</span>
        </span>
        <UIcon v-if="state === 'expanded'" name="i-lucide-chevron-down" class="size-4 shrink-0 text-muted" />
      </button>
    </template>

    <template #sidebar-default="{ state }">
      <div class="-mx-2 -mt-2 flex flex-col">
        <button type="button" class="flex items-center gap-2 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated">
          <UIcon name="i-lucide-search" class="size-4 shrink-0 text-highlighted" />
          <template v-if="state === 'expanded'">
            <span class="flex-1 text-sm font-medium text-highlighted">{{ t.casca.buscar }}</span>
            <UKbd value="ctrl" size="sm" />
            <UKbd value="K" size="sm" />
          </template>
        </button>

        <nav :aria-label="t.casca.menuLateral">
          <template v-for="grupo in [{ titulo: t.casca.membro, itens: membro }, { titulo: t.casca.configuracoes, itens: configuracoes }, { titulo: t.casca.ajuda, itens: ajuda }]" :key="grupo.titulo">
            <p v-if="state === 'expanded'" class="px-2 pb-1 pt-5 text-xs text-muted">{{ grupo.titulo }}</p>
            <USeparator v-else class="my-3" />
            <template v-for="e in grupo.itens" :key="e.chave">
              <UTooltip :text="t.casca.itens[e.chave]" :disabled="state === 'expanded'" :content="{ side: 'right' }">
                <button
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left transition-colors hover:bg-elevated"
                  :class="e.chave === aberto ? 'font-medium text-highlighted' : 'text-toned'"
                >
                  <UIcon :name="e.icone" class="size-4 shrink-0" :class="e.chave === aberto ? 'text-highlighted' : 'text-muted'" />
                  <template v-if="state === 'expanded'">
                    <span class="flex-1 truncate text-sm">{{ t.casca.itens[e.chave] }}</span>
                    <UIcon v-if="e.externo" name="i-lucide-arrow-up-right" class="size-3 shrink-0 text-dimmed" />
                    <UIcon v-else-if="e.filhos" :name="e.chave === aberto ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'" class="size-4 shrink-0 text-muted" />
                  </template>
                </button>
              </UTooltip>
              <div v-if="state === 'expanded' && e.chave === 'tarefas' && aberto === 'tarefas'" class="flex flex-col">
                <button
                  v-for="f in filhosDeTarefas"
                  :key="f.nome"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-6 pr-2 text-left text-sm transition-colors"
                  :class="f.ativo ? 'font-medium text-highlighted' : 'text-toned hover:bg-elevated'"
                  :aria-current="f.ativo ? 'page' : undefined"
                >
                  <UIcon :name="f.icone" class="size-4 shrink-0" :class="f.ativo ? 'text-primary' : 'text-muted'" />
                  <span class="flex-1 truncate">{{ f.nome }}</span>
                </button>
              </div>
              <div v-if="state === 'expanded' && e.chave === 'categorias' && aberto === 'categorias'" class="flex flex-col">
                <button
                  v-for="c in categoriasDoMenu"
                  :key="c.nome"
                  type="button"
                  class="flex w-full items-center gap-2.5 rounded-md py-1.5 pl-7 pr-2 text-left text-sm transition-colors"
                  :class="c.ativo ? 'font-medium text-highlighted' : 'text-toned hover:bg-elevated'"
                  :aria-current="c.ativo ? 'page' : undefined"
                >
                  <span class="flex-1 truncate">{{ c.nome }}</span>
                </button>
              </div>
            </template>
          </template>
        </nav>
      </div>
    </template>

    <template #navbar-title>
      <div class="flex w-[min(50rem,calc(100vw-30rem))] min-w-0 items-center gap-1 font-normal">
        <UButton icon="i-lucide-arrow-left" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.voltar" />
        <UButton icon="i-lucide-arrow-right" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.avancar" />
        <UButton icon="i-lucide-rotate-cw" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.recarregar" />
        <UButton icon="i-lucide-house" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.itens.inicio" />
        <div class="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md bg-elevated/70 px-3 py-1.5">
          <nav class="flex min-w-0 items-center gap-1.5 text-xs" :aria-label="t.casca.trilha">
            <template v-for="(parte, i) in trilha" :key="i">
              <UIcon v-if="i" name="i-lucide-chevron-right" class="size-3 shrink-0 text-dimmed" />
              <span class="truncate" :class="i === trilha.length - 1 ? 'text-highlighted' : 'text-toned'">{{ parte }}</span>
            </template>
          </nav>
          <span class="ml-auto flex shrink-0 items-center gap-1">
            <UKbd value="ctrl" size="sm" />
            <UKbd value="B" size="sm" />
            <UIcon name="i-lucide-star" class="ml-1 size-3.5 text-muted" />
          </span>
        </div>
      </div>
    </template>

    <template #navbar-trailing>
      <span class="flex size-6 items-center justify-center rounded-full bg-success/15 text-[9px] font-bold text-success" :aria-label="t.casca.idioma">BR</span>
      <UButton icon="i-lucide-sun" color="neutral" variant="ghost" size="xs" :aria-label="t.casca.tema" />
      <UButton icon="i-lucide-headset" :label="t.casca.suporte" color="neutral" variant="outline" size="xs" />
      <UPopover v-model:open="sinoAberto" :content="{ align: 'end', sideOffset: 8 }">
        <UChip :text="naoLidas ? String(naoLidas) : undefined" :show="!!naoLidas" color="error" size="3xl">
          <UButton icon="i-lucide-bell" color="neutral" variant="ghost" size="xs" :aria-label="naoLidas ? t.avisos.naoLidas(naoLidas) : t.casca.notificacoes" />
        </UChip>
        <template #content>
          <div class="flex w-96 max-w-[calc(100vw-2rem)] flex-col">
            <div class="flex items-center justify-between gap-2 border-b border-default px-4 py-2.5">
              <p class="text-sm font-semibold text-highlighted">{{ t.casca.notificacoes }}</p>
              <UButton v-if="naoLidas" :label="t.avisos.marcarLidas" icon="i-lucide-check-check" color="neutral" variant="ghost" size="xs" @click="emit('marcarLidas')" />
            </div>
            <ul v-if="avisos?.length" class="flex max-h-96 flex-col overflow-y-auto">
              <li v-for="a in avisos" :key="a.id">
                <button
                  type="button"
                  class="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-elevated"
                  :class="a.lida ? '' : 'bg-primary/5'"
                  @click="abrirAviso(a.id)"
                >
                  <UAvatar :text="a.iniciais" size="sm" class="shrink-0" />
                  <span class="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span class="text-sm text-default" :class="a.lida ? '' : 'font-medium text-highlighted'">{{ a.texto }}</span>
                    <span class="text-xs text-dimmed">{{ a.quando }}</span>
                  </span>
                  <span v-if="!a.lida" class="mt-1.5 size-2 shrink-0 rounded-full bg-primary" :aria-label="t.avisos.naoLida" />
                </button>
              </li>
            </ul>
            <p v-else class="flex flex-col items-center gap-2 px-4 py-8 text-center text-sm text-muted">
              <UIcon name="i-lucide-bell-off" class="size-6 text-dimmed" />{{ t.avisos.vazio }}
            </p>
          </div>
        </template>
      </UPopover>
      <UChip color="success" size="sm" inset>
        <UAvatar size="sm" text="MJ" alt="Pessoa logada" />
      </UChip>
    </template>

    <slot />
  </EnLayout>
</template>

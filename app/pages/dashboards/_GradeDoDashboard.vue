<script setup lang="ts">
/**
 * A grade do dashboard: `EnDashboardCanvas` e `useDashboardLayout` do SDK 0.21
 * (gridstack 14 por baixo, 12 colunas), a mesma peça que o painel de tarefas usa.
 *
 * O SDK foi feito para painel declarado em código; aqui os painéis são os que a
 * pessoa criou. A lista que vai para o `useDashboardLayout` é reativa: painel novo
 * entra no primeiro espaço livre e painel excluído sai, sem mexer nos outros.
 *
 * O layout fica num `Map` em memória (no produto, o adaptador de storage grava no
 * back-end): recarregar a página volta ao arranjo inicial.
 */
import type { DashboardLayoutStorage, DashboardPanelDef } from '@be-enlighten/enspace-sdk-ui/base'
import { useDashboardLayout } from '@be-enlighten/enspace-sdk-ui/base'
import type { ConfigDoPainel, Grupo, Resultado } from './agregacao'
import type { Dashboard } from './dashboards'
import type { Textos } from './textos'
import PainelDoDashboard from './_PainelDoDashboard.vue'

const props = defineProps<{
  t: Textos
  dashboard: Dashboard
  resultados: Record<string, Resultado>
  estadoDe: (id: string) => 'pronto' | 'carregando' | 'erro'
  titulos: Record<string, string>
  editavel: boolean
  somenteLeitura: boolean
  rotuloDoPeriodo: string
}>()

const emit = defineEmits<{
  editar: [cfg: ConfigDoPainel]
  duplicar: [cfg: ConfigDoPainel]
  excluir: [cfg: ConfigDoPainel]
  csv: [cfg: ConfigDoPainel]
  tentar: [cfg: ConfigDoPainel]
  detalhar: [cfg: ConfigDoPainel, grupo?: Grupo, parte?: string]
  concluir: []
}>()

const memoria = useState<Record<string, unknown>>('dashboards-layout', () => ({}))
const storage: DashboardLayoutStorage = {
  load: k => memoria.value[k] ?? null,
  save: (k, layout) => { memoria.value = { ...memoria.value, [k]: layout } },
}

const definicoes = computed<DashboardPanelDef[]>(() => props.dashboard.paineis.map(p => ({
  id: p.id,
  titleKey: `dashboards.painel.${p.id}`,
  title: props.titulos[p.id] ?? p.id,
  defaultSize: { w: p.w, h: p.h },
  minSize: { w: 2, h: 2 },
})))

const layout = useDashboardLayout({
  dashboardId: props.dashboard.id,
  panels: definicoes,
  scope: { workspaceId: 'teste-ux', userId: 'prototipo' },
  storage,
  saveDelay: 200,
})

const porId = computed(() => new Map(props.dashboard.paineis.map(p => [p.id, p])))
</script>

<template>
  <div class="flex flex-col gap-3">
    <EnDashboardCustomize
      v-if="editavel"
      :dashboard="layout"
      :locale="(t.locale as any)"
      @done="emit('concluir')"
    />

    <EnDashboardCanvas
      :dashboard="layout"
      :editable="editavel"
      :row-height="80"
      :gap="16"
      bare
      :locale="(t.locale as any)"
    >
      <template #panel="{ panel }">
        <PainelDoDashboard
          v-if="porId.get(panel.id)"
          :t="t"
          :cfg="porId.get(panel.id)!"
          :resultado="resultados[panel.id]!"
          :estado="estadoDe(panel.id)"
          :editavel="editavel"
          :somente-leitura="somenteLeitura"
          :rotulo-do-periodo="rotuloDoPeriodo"
          @editar="emit('editar', porId.get(panel.id)!)"
          @duplicar="emit('duplicar', porId.get(panel.id)!)"
          @excluir="emit('excluir', porId.get(panel.id)!)"
          @csv="emit('csv', porId.get(panel.id)!)"
          @tentar="emit('tentar', porId.get(panel.id)!)"
          @detalhar="(g?: Grupo, p?: string) => emit('detalhar', porId.get(panel.id)!, g, p)"
        />
      </template>
    </EnDashboardCanvas>
  </div>
</template>
